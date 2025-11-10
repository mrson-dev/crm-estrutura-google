import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpinnerIcon } from './icons';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('lawyer@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simula uma chamada de API para o Firebase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'lawyer@example.com' && password === 'password123') {
      onLoginSuccess();
      navigate('/');
    } else {
      setError('Email ou senha inválidos.');
    }
    setIsLoading(false);
  };

  const inputClasses = "w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-primary focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 ml-3">IntelliJuris</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Seu Parceiro Inteligente na Advocacia</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Endereço de e-mail</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${inputClasses} rounded-lg`}
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`${inputClasses} rounded-lg`}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-sky-700 dark:hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-slate-400 disabled:dark:bg-slate-600 transition-colors duration-300"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-2" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;