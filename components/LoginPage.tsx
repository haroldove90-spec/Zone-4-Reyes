
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, AppleIcon } from './icons';

const LoginPage: React.FC = () => {
  const { login, signUp } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isLoginView) {
        result = await login({ email, password });
      } else {
        result = await signUp({ name, email, password });
      }
      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-z-bg-primary dark:bg-z-bg-primary-dark p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src="https://appdesignmex.com/Zone4Reyes.png" alt="Logo" className="h-[40px] mx-auto mb-4" loading="lazy" />
            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Reyes Iztacala</h1>
            <p className="text-z-text-secondary dark:text-z-text-secondary-dark">La Red social oficial</p>
        </div>

        <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} noValidate>
            {!isLoginView && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1" htmlFor="name">
                  Nombre Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 transition-colors focus:ring-z-primary/50"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 transition-colors focus:ring-z-primary/50"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 transition-colors focus:ring-z-primary/50"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-z-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-z-dark-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-z-primary dark:focus:ring-offset-z-bg-secondary-dark disabled:bg-gray-400"
            >
              {loading ? 'Cargando...' : (isLoginView ? 'Iniciar Sesión' : 'Registrarse')}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-z-text-secondary dark:text-z-text-secondary-dark mt-6">
            {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-medium text-z-primary hover:underline ml-1">
                {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
            </button>
        </p>
         <p className="text-center text-xs text-z-text-secondary dark:text-z-text-secondary-dark mt-4">
            (Admin: usa <b>admin@example.com</b> para acceder al dashboard.)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;