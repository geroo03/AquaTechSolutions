import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { LoaderCircle, Lock } from 'lucide-react';
import { LogoMark } from '../components/Brand';
import { fetchAll, signIn, signOut, supabase, type Session } from './cloud';
import type { Budget, CatalogItem, Issuer } from './model';
import BudgetApp from './BudgetApp';

type Data = { budgets: Budget[]; issuer: Issuer; catalog: CatalogItem[] };

/** Login: sin sesión no se ve el panel, y la base no devuelve nada sin la cuenta de Martín. */
export default function Gate() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [data, setData] = useState<Data | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    setData(null);
    setLoadError(false);
    if (!userId) return;
    fetchAll().then(setData, () => setLoadError(true));
  }, [userId]);

  const ready = session === null || Boolean(data) || loadError;
  useEffect(() => {
    if (ready) document.documentElement.dataset.ready = 'true';
  }, [ready]);

  if (session === null) return <Login />;
  if (session && data) return <BudgetApp key={session.user.id} email={session.user.email ?? ''} initialBudgets={data.budgets} initialIssuer={data.issuer} initialCatalog={data.catalog} />;
  return (
    <Screen>
      {loadError ? (
        <div className="text-center">
          <p className="text-graphite">No se pudieron cargar los presupuestos. Revisá la conexión.</p>
          <div className="mt-5 flex justify-center gap-2">
            <button type="button" onClick={() => window.location.reload()} className="h-11 px-5 rounded-full bg-ink text-white text-sm font-semibold">Reintentar</button>
            <button type="button" onClick={() => signOut()} className="h-11 px-5 rounded-full ring-1 ring-line text-sm font-semibold">Cerrar sesión</button>
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center gap-2 text-muted"><LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> Cargando…</p>
      )}
    </Screen>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-paper">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="w-14 h-14 rounded-2xl bg-ink text-white flex items-center justify-center"><LogoMark size={28} /></span>
          <p className="mt-4 font-headline text-xl font-bold tracking-[0.04em]">AQUATECH</p>
          <p className="text-sm text-muted">Panel de presupuestos</p>
        </div>
        {children}
      </div>
    </main>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const message = await signIn(email, password);
    setBusy(false);
    if (message) setError(message);
  };
  const field = 'mt-1.5 w-full rounded-2xl bg-paper ring-1 ring-line px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-ink';
  return (
    <Screen>
      <form onSubmit={submit} className="rounded-3xl bg-white ring-1 ring-line p-6 sm:p-7 grid gap-4">
        <h1 className="flex items-center gap-2 font-headline text-xl font-bold"><Lock size={18} aria-hidden="true" /> Ingresar</h1>
        <label className="text-sm font-medium">Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" inputMode="email" className={field} />
        </label>
        <label className="text-sm font-medium">Contraseña
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className={field} />
        </label>
        {error && <p role="alert" className="text-sm font-medium text-ink">{error}</p>}
        <button type="submit" disabled={busy} className="h-12 rounded-full bg-ink text-white font-semibold hover:bg-graphite disabled:opacity-60 inline-flex items-center justify-center gap-2">
          {busy && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />} Entrar
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-muted">Acceso solo para AquaTech Solutions.</p>
    </Screen>
  );
}
