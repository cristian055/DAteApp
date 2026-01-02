
import React from 'react';
import { User, Couple } from '../types';
import { mockDb } from '../lib/mockDb';

interface Props {
  user: User;
  couple: Couple | null;
  onLogout: () => void;
}

const Settings: React.FC<Props> = ({ user, couple, onLogout }) => {
  const partnerId = couple?.user_a_id === user.id ? couple?.user_b_id : couple?.user_a_id;
  const partner = partnerId ? mockDb.getUser(partnerId) : null;

  const handleResetData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('meta_pareja_db');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 transition-theme">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Ajustes</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-theme">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Perfil</h3>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center text-2xl font-black text-pink-600 dark:text-pink-400">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">{user.email}</p>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-theme">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Pareja</h3>
        {partner ? (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-xl font-black text-blue-600 dark:text-blue-400">
                        {partner.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">{partner.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Vinculados</p>
                    </div>
                </div>
                <button className="text-xs text-red-500 dark:text-red-400 font-bold hover:underline">Desvincular</button>
            </div>
        ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">Aún no tienes pareja vinculada.</p>
        )}
      </div>

      <div className="space-y-3">
        <button className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-left font-bold text-gray-700 dark:text-gray-300 flex justify-between items-center group transition-theme">
            <span>Notificaciones Push</span>
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-pink-500 rounded-full shadow-sm"></div>
            </div>
        </button>
        <button className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-left font-bold text-gray-700 dark:text-gray-300 flex justify-between items-center transition-theme">
            <span>Idioma</span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">Español</span>
        </button>
        <button 
          onClick={handleResetData}
          className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-left font-bold text-indigo-600 dark:text-indigo-400 flex justify-between items-center transition-theme"
        >
            <span>Limpiar datos locales</span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">Modo Dev</span>
        </button>
      </div>

      <button 
        onClick={onLogout}
        className="w-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 py-4 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors mt-8 border border-red-100 dark:border-red-900"
      >
        Cerrar Sesión
      </button>

      <p className="text-center text-gray-300 dark:text-gray-700 text-xs mt-12">Meta Pareja MVP v1.0.0</p>
    </div>
  );
};

export default Settings;
