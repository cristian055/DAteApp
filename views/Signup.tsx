
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { mockDb } from '../lib/mockDb';

interface Props {
  onSignup: (user: User) => void;
}

const Signup: React.FC<Props> = ({ onSignup }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Simulate Google OAuth delay
    setTimeout(() => {
      const email = `new.user.${Math.floor(Math.random() * 1000)}@gmail.com`;
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: 'Nuevo Aventurero',
        currency: 'COP'
      };
      mockDb.createUser(user);
      onSignup(user);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 transition-theme">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 text-center">
        <div className="text-5xl mb-6">✨</div>
        <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100 mb-2">Crea tu cuenta</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-sm">Empieza tu viaje de ahorro en segundos.</p>
        
        <button 
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-4 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600 dark:border-pink-400"></div>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Registrarse con Google</span>
            </>
          )}
        </button>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-pink-600 dark:text-pink-400 font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
