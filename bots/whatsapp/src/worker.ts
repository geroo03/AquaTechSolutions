import type { Config } from './config.js';
import { localClock, withinHours } from './domain.js';
import type { Store } from './store.js';

export interface Sender {
  ready(): boolean;
  send(phone: string, body: string, jobId: number): Promise<string>;
  close(): Promise<void>;
}

export class SimulationSender implements Sender {
  ready() { return true; }
  async send(_phone: string, _body: string, jobId: number) { return `simulation-${jobId}`; }
  async close() {}
}

export class Worker {
  private busy = false;
  private timer?: NodeJS.Timeout;
  private active?: Promise<void>;
  constructor(private store: Store, private config: Config, private sender: Sender, private sourceHealthy: (now: Date) => boolean) {}
  tick(now = new Date()) {
    if (this.busy) return Promise.resolve();
    this.busy = true;
    this.active = this.run(now).finally(() => { this.busy = false; });
    return this.active;
  }
  private async run(now: Date) {
    if (!withinHours(now, this.config) || this.store.setting('paused') || !this.sourceHealthy(now) || !this.sender.ready()) return;
    const job = this.store.nextJob(this.config.MODE, now);
    if (!job) return;
    const contact = this.store.contact(job.contact_id);
    if (!contact) { this.store.finishJob(job.id, 'cancelled', 'missing_contact'); return; }
    const day = localClock(now, this.config.TIME_ZONE).day;
    if (!this.store.claim(job, day, this.config.DAILY_LIMIT, now, this.config.SEND_INTERVAL_SECONDS)) return;
    try {
      const providerId = await this.sender.send(contact.phone, job.body, job.id);
      this.store.finishJob(job.id, job.mode === 'simulation' ? 'simulated' : 'sent', 'accepted_by_provider', providerId);
      this.store.audit('job_completed', contact.id, JSON.stringify({ jobId: job.id, mode: job.mode }));
    } catch {
      // Una falla después de invocar el envío puede haber entregado el mensaje.
      this.store.finishJob(job.id, 'unknown', 'send_result_unknown');
      this.store.pause('send_result_unknown');
    }
  }
  start(onError: () => void) {
    this.timer = setInterval(() => { void this.tick().catch(() => { this.store.pause('worker_error'); onError(); }); }, 1000);
  }
  async stop() { if (this.timer) clearInterval(this.timer); await this.active; }
}
