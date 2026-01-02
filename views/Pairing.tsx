
import React, { useState } from 'react';
import { User, NotificationType, GoalStatus } from '../types';
import { mockDb } from '../lib/mockDb';

interface Props {
  user: User;
  onComplete: () => void;
}

const Pairing: React.FC<Props> = ({ user, onComplete }) => {
  const [mode, setMode] = useState<'selection' | 'invite' | 'join'>('selection');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerateCode = () => {
    const code = mockDb.createInvite(user.id);
    setGeneratedCode(code);
    setMode('invite');
  };

  const handleDevelopMode = () => {
    // 1. Create a virtual partner
    const virtualPartner: User = {
      id: 'virtual_partner_id',
      name: 'Pareja Virtual 🤖',
      email: 'bot@metapareja.com',
      currency: 'COP'
    };
    mockDb.createUser(virtualPartner);

    // 2. Link them
    const couple = mockDb.createCouple(user.id, virtualPartner.id);

    // 3. Create sample goals
    mockDb.createGoal({
      id: 'demo_goal_1',
      couple_id: couple.id,
      created_by_id: user.id,
      name: 'Viaje a la Playa',
      emoji: '🏖️',
      target_amount: 5000000,
      current_amount: 1250000,
      target_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: GoalStatus.ACTIVE,
      created_at: new Date(Date.now() - 10000).toISOString()
    });

    mockDb.createGoal({
      id: 'demo_goal_2',
      couple_id: couple.id,
      created_by_id: user.id,
      name: 'Fondo de Emergencia',
      emoji: '🛡️',
      target_amount: 10000000,
      current_amount: 450000,
      target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: GoalStatus.ACTIVE,
      created_at: new Date().toISOString()
    });

    // 4. Set a welcome notification
    mockDb.createNotification({
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      type: NotificationType.PARTNER_JOINED,
      title: '¡Modo Desarrollo Activado!',
      body: 'Tu pareja virtual se ha unido y hemos creado dos metas de ejemplo para que explores el sistema multi-meta.',
      is_read: false,
      created_at: new Date().toISOString()
    });

    onComplete();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const invite = mockDb.consumeInvite(inviteCode);
    if (!invite) {
      setError('Código inválido o expirado.');
      return;
    }
    if (invite.inviterId === user.id) {
        setError('No puedes usar tu propio código.');
        return;
    }

    mockDb.createCouple(invite.inviterId, user.id);
    
    // Notify partner
    mockDb.createNotification({
        id: Math.random().toString(36).substr(2, 9),
        user_id: invite.inviterId,
        type: NotificationType.PARTNER_JOINED,
        title: '¡Ya son pareja!',
        body: `${user.name} se ha unido. Ya pueden crear su primera meta.`,
        is_read: false,
        created_at: new Date().toISOString()
    });

    onComplete();
  };

  if (mode === 'invite') {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mt-8 transition-theme">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Código de Invitación</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Comparte este código con tu pareja para unirse:</p>
        
        <div className="bg-pink-50 dark:bg-pink-900/20 border-2 border-dashed border-pink-200 dark:border-pink-800 rounded-2xl p-6 flex flex-col items-center transition-theme">
          <span className="text-4xl font-black tracking-widest text-pink-600 dark:text-pink-400 mb-2">{generatedCode}</span>
          <p className="text-xs text-pink-400 dark:text-pink-500">Válido por 24 horas</p>
        </div>

        <button 
          onClick={() => {
            navigator.clipboard.writeText(generatedCode);
            alert('Código copiado al portapapeles');
          }}
          className="w-full mt-6 bg-pink-100 dark:bg-pink-600 text-pink-600 dark:text-white py-3 rounded-xl font-bold hover:bg-pink-200 dark:hover:bg-pink-500 transition-colors"
        >
          Copiar Código
        </button>

        <button 
          onClick={() => window.location.reload()}
          className="w-full mt-2 text-gray-400 dark:text-gray-500 text-sm py-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Ya compartí el código, esperar a mi pareja
        </button>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mt-8 transition-theme">
        <button onClick={() => setMode('selection')} className="text-pink-600 dark:text-pink-400 text-sm font-bold mb-4 flex items-center gap-1">
          ← Volver
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Unirse a pareja</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Ingresa el código que te compartió tu pareja:</p>
        
        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 transition-theme">{error}</div>}

        <form onSubmit={handleJoin} className="space-y-4">
          <input 
            type="text" 
            placeholder="A1B2C3"
            required
            autoFocus
            className="w-full text-center text-3xl font-black tracking-widest uppercase px-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:border-pink-500 dark:focus:border-pink-400 outline-none transition-theme"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
          <button 
            type="submit"
            className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 shadow-lg shadow-pink-200 dark:shadow-none transition-all transform active:scale-[0.98]"
          >
            Unirse
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-8 px-4 transition-theme">
      <div className="text-center">
        <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100 mb-2">Conéctate</h1>
        <p className="text-gray-500 dark:text-gray-400">Para ahorrar juntos, primero debemos vincularlos.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        <button 
          onClick={handleGenerateCode}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-sm hover:border-pink-500 dark:hover:border-pink-400 transition-all text-left group"
        >
          <div className="bg-pink-100 dark:bg-pink-900/40 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:bg-pink-500 group-hover:text-white transition-all">✨</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 transition-colors">Soy el primero</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Generaré un código para invitar a mi pareja.</p>
        </button>

        <button 
          onClick={() => setMode('join')}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all text-left group"
        >
          <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:bg-blue-500 group-hover:text-white transition-all">🗝️</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 transition-colors">Tengo un código</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Mi pareja ya me envió un código de acceso.</p>
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-gray-800"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black text-gray-300 dark:text-gray-700 tracking-widest"><span className="bg-gray-50 dark:bg-gray-950 px-2 transition-theme">Solo para pruebas</span></div>
        </div>

        <button 
          onClick={handleDevelopMode}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none text-left group transform hover:-translate-y-1 transition-all"
        >
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 text-white">🚀</div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Modo Desarrollo</h3>
          <p className="text-indigo-100 text-xs mt-1">Explora las funciones con una pareja y múltiples metas.</p>
        </button>
      </div>
    </div>
  );
};

export default Pairing;
