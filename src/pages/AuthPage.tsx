import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { inputClass, btnPrimary } from '../components/ui';
import type { useAuth } from '../hooks/useAuth';

type AuthHook = ReturnType<typeof useAuth>;

export function AuthPage({ signIn, signUp }: Pick<AuthHook, 'signIn' | 'signUp'>) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        setSuccess('Cuenta creada. Revisa tu email para confirmar (o inicia sesión directamente si el correo está desactivado).');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F4F6FB' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#0E7C86' }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight">FrangLish</div>
            <div className="text-xs text-[#5B6678]">Senior · Módulos 1–5</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E3E8F2] p-7">
          <h2 className="text-xl font-bold mb-5 text-center">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          <form onSubmit={submit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <label className="block">
                <span className="text-xs font-semibold text-[#5B6678] mb-1 block">Nombre</span>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Francisco Castillo" className={inputClass} required
                />
              </label>
            )}
            <label className="block">
              <span className="text-xs font-semibold text-[#5B6678] mb-1 block">Email</span>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" className={inputClass} required
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#5B6678] mb-1 block">Contraseña</span>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className={inputClass} required minLength={6}
              />
            </label>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                {success}
              </div>
            )}

            <button type="submit" disabled={loading} className={btnPrimary + ' justify-center w-full py-3 text-base'}>
              {loading ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-[#5B6678] mt-4">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-[#0E7C86] font-semibold bg-none border-none cursor-pointer p-0"
            >
              {mode === 'login' ? 'Registrarse' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
