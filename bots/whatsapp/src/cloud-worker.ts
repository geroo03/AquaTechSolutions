import type { Config } from './config.js';
import { MetaRejectedError } from './cloud-api.js';
import { localClock } from './domain.js';
import type { Store } from './store.js';

export interface TextSender { ready(): boolean; sendText(phone: string, text: string, replyId: number): Promise<string> }
export class CloudWorker {
  private active?: Promise<void>;
  private timer?: NodeJS.Timeout;
  constructor(private store: Store, private config: Config, private sender: TextSender) {}
  tick(now = new Date()) {
    if (this.active) return this.active;
    this.active = this.run(now).finally(() => { this.active = undefined; });
    return this.active;
  }
  private async run(now: Date) {
    if (!this.sender.ready()) return;
    const reply = this.store.claimCloudReply(this.config.MODE, localClock(now, this.config.TIME_ZONE).day, this.config.DAILY_LIMIT, now);
    if (!reply) return;
    try {
      const id = await this.sender.sendText(reply.phone, reply.body, reply.id);
      this.store.finishCloudReply(reply.id, this.config.MODE === 'simulation' ? 'simulated' : 'sent', 'accepted_by_provider', id);
    } catch (error) {
      this.store.finishCloudReply(reply.id, error instanceof MetaRejectedError ? 'failed' : 'unknown', error instanceof MetaRejectedError ? `meta_http_${error.status}` : 'send_result_unknown');
      this.store.pause(error instanceof MetaRejectedError ? 'meta_rejected' : 'send_result_unknown');
    }
  }
  start() { this.timer = setInterval(() => { void this.tick().catch(() => this.store.pause('cloud_worker_error')); }, 1000); }
  async stop() { if (this.timer) clearInterval(this.timer); await this.active; }
}
