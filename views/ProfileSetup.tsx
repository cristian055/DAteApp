
import React, { useState } from 'react';
import { User } from '../types';
import { mockDb } from '../lib/mockDb';

interface Props {
  user: User;
  onComplete: () => void;
}

const ProfileSetup: React.FC<Props> = ({ user, onComplete }) => {
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    const updatedUser = { ...user, name };
    mockDb.createUser(updatedUser); // Update logic: since it's mock, we re-create/save
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] transition-theme">
        <div className="w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Configura tu perfil</h2>
            <div className="mb-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center text-4xl mb-2">👤</div>
                <button className="text-xs text-pink-600 dark:text-pink-400 font-bold">Cambiar foto (Próximamente)</button>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Cómo te llamas?</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 outline-none transition-theme"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleSave}
                    className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 shadow-lg shadow-pink-200 dark:shadow-none"
                >
                    Guardar y Continuar
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProfileSetup;
