
import React, { useState } from 'react';
import { Couple, Goal, GoalStatus } from '../types';
import { mockDb } from '../lib/mockDb';

interface Props {
  couple: Couple;
  creatorId: string;
  onComplete: () => void;
}

const GoalSetup: React.FC<Props> = ({ couple, creatorId, onComplete }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏖️');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [targetDate, setTargetDate] = useState('');

  const emojis = ['🏖️', '🏠', '🚗', '💍', '👶', '✈️', '💻', '🎮', '🍕'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetAmount <= 0) return;

    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      couple_id: couple.id,
      created_by_id: creatorId,
      name,
      emoji,
      target_amount: targetAmount,
      current_amount: 0,
      target_date: targetDate,
      status: GoalStatus.ACTIVE,
      created_at: new Date().toISOString()
    };

    mockDb.createGoal(newGoal);
    onComplete();
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mt-8 transition-theme">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Su Meta</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">¿Hacia dónde están ahorrando hoy?</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Elige un emoji</label>
          <div className="flex flex-wrap gap-2">
            {emojis.map(e => (
              <button 
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`w-12 h-12 text-2xl flex items-center justify-center rounded-xl border-2 transition-all ${emoji === e ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 scale-110 shadow-md' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la meta</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 outline-none transition-theme"
            placeholder="Ej: Viaje a Cartagena"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Objetivo ($)</label>
          <input 
            type="number" 
            required
            min="1000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 outline-none transition-theme"
            placeholder="Ej: 2000000"
            value={targetAmount || ''}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Límite</label>
          <input 
            type="date" 
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 outline-none transition-theme"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 shadow-lg shadow-pink-200 dark:shadow-none transition-all transform active:scale-[0.98]"
        >
          ¡Vamos a por ello! 🚀
        </button>
      </form>
    </div>
  );
};

export default GoalSetup;
