/**
 * Guardado en la nube (Supabase, proyecto "aquatech-presupuestos").
 * La clave es pública a propósito: la seguridad está en la base. Solo puede existir el usuario de Martín
 * (un trigger rechaza cualquier otro registro) y las políticas RLS dejan ver y editar únicamente lo propio.
 */
import { createClient, type Session } from '@supabase/supabase-js';
import config from './supabase.json' with { type: 'json' };
import { DEFAULT_ISSUER, type Budget, type Issuer } from './model';

export const supabase = createClient(config.url, config.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'aquatech.sesion' },
});

export type { Session };

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (!error) return null;
  if (error.status === 400) return 'El mail o la contraseña no son correctos.';
  return 'No se pudo entrar. Revisá la conexión e intentá de nuevo.';
}

export const signOut = () => supabase.auth.signOut();

export async function changePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  return error ? (error.code === 'same_password' ? 'Es la misma contraseña que ya tenías.' : 'No se pudo cambiar la contraseña.') : null;
}

export async function fetchAll(): Promise<{ budgets: Budget[]; issuer: Issuer }> {
  const [budgets, issuer] = await Promise.all([
    supabase.from('presupuestos').select('data').order('updated_at', { ascending: false }),
    supabase.from('emisor').select('data').maybeSingle(),
  ]);
  if (budgets.error) throw budgets.error;
  if (issuer.error) throw issuer.error;
  return {
    budgets: budgets.data.map(row => row.data as Budget).filter(b => b && b.id && Array.isArray(b.lines)),
    issuer: { ...DEFAULT_ISSUER, ...(issuer.data?.data as Partial<Issuer> | undefined) },
  };
}

export async function saveBudgetsRemote(budgets: Budget[]) {
  if (!budgets.length) return;
  const { error } = await supabase.from('presupuestos').upsert(budgets.map(b => ({ id: b.id, data: b, updated_at: new Date(b.updatedAt).toISOString() })));
  if (error) throw error;
}

export async function deleteBudgetRemote(id: string) {
  const { error } = await supabase.from('presupuestos').delete().eq('id', id);
  if (error) throw error;
}

export async function saveIssuerRemote(issuer: Issuer) {
  const { error } = await supabase.from('emisor').upsert({ data: issuer, updated_at: new Date().toISOString() });
  if (error) throw error;
}
