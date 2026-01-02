
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Couple } from '../types';
import { mockDb } from '../lib/mockDb';
import { calculateProgress, formatCurrency } from '../lib/calculations';

interface Props {
  user: User;
  couple: Couple;
  refresh: () => void;
}

const Dashboard: React.FC<Props> = ({ user, couple, refresh }) => {
  const goals = mockDb.getGoals(couple.id);
  const partnerId = couple.user_a_id === user.id ? couple.user_b_id : couple.user_a_id;
  const partner = mockDb.getUser(partnerId);

  return (
    <div className="space-y-6 pb-20 transition-theme">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100">Nuestras Metas</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Ahorrando juntos para lo que importa.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current_amount, goal.target_amount);
          return (
            <Link 
              key={goal.id} 
              to={`/goal/${goal.id}`}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative"
            >
              <div className="absolute -right-4 -top-4 text-7xl opacity-5 dark:opacity-10 group-hover:opacity-15 transition-opacity">
                {goal.emoji}
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl bg-gray-50 dark:bg-gray-800 w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-50 dark:border-gray-700 shadow-inner group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30 transition-colors">
                    {goal.emoji}
                  </span>
                  <div>
                    <h3 className="font-black text-gray-800 dark:text-gray-100 text-lg leading-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{goal.name}</h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">
                        {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400">
                        <span>Progreso</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-pink-500 to-rose-400 dark:from-pink-600 dark:to-rose-500 h-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
              </div>
            </Link>
          );
        })}

        <Link 
          to="/goal-setup"
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2 hover:border-pink-300 dark:hover:border-pink-900 hover:bg-pink-50/30 dark:hover:bg-pink-900/10 transition-all text-gray-400 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400"
        >
          <span className="text-3xl">➕</span>
          <span className="font-black text-sm uppercase tracking-widest">Añadir Nueva Meta</span>
        </Link>
      </div>

      {partnerId === 'virtual_partner_id' && (
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 p-4 rounded-2xl flex items-center gap-3 mt-8 transition-theme">
            <span className="text-xl">💡</span>
            <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">Estás en <b>Modo Desarrollo</b>. Puedes crear tantas metas como quieras para probar la navegación.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
