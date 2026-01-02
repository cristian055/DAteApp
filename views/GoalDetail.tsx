
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Couple, Goal, NotificationType } from '../types';
import { mockDb } from '../lib/mockDb';
import { calculateProgress, getDaysRemaining, formatCurrency, getWeeklyRequired } from '../lib/calculations';
import { getFinancialAdvice } from '../geminiService';

interface Props {
  user: User;
  couple: Couple;
  goal: Goal;
  refresh: () => void;
}

const GoalDetail: React.FC<Props> = ({ user, couple, goal, refresh }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | string>('');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const deposits = mockDb.getDepositsForGoal(goal.id);
  const progress = calculateProgress(goal.current_amount, goal.target_amount);
  const daysLeft = getDaysRemaining(goal.target_date);
  const weekly = getWeeklyRequired(goal.target_amount, goal.current_amount, goal.target_date);

  const partnerId = couple.user_a_id === user.id ? couple.user_b_id : couple.user_a_id;
  const partner = mockDb.getUser(partnerId);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAi(true);
      const advice = await getFinancialAdvice(goal, user.name, partner?.name || 'tu pareja');
      setAiAdvice(advice);
      setLoadingAi(false);
    };
    fetchAdvice();
  }, [goal.id]);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(depositAmount);
    if (amountNum <= 0) return;

    mockDb.createDeposit({
      id: Math.random().toString(36).substr(2, 9),
      goal_id: goal.id,
      user_id: user.id,
      amount: amountNum,
      created_at: new Date().toISOString()
    });

    mockDb.createNotification({
        id: Math.random().toString(36).substr(2, 9),
        user_id: partnerId,
        type: NotificationType.DEPOSIT,
        title: '¡Aporte recibido!',
        body: `${user.name} acaba de aportar ${formatCurrency(amountNum)} a la meta "${goal.name}".`,
        is_read: false,
        created_at: new Date().toISOString()
    });

    setShowDepositModal(false);
    setDepositAmount('');
    refresh();
  };

  const simulatePartnerDeposit = () => {
    const randomAmounts = [25000, 50000, 100000, 250000];
    const amount = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];
    
    mockDb.createDeposit({
      id: Math.random().toString(36).substr(2, 9),
      goal_id: goal.id,
      user_id: partnerId,
      amount: amount,
      created_at: new Date().toISOString()
    });

    mockDb.createNotification({
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        type: NotificationType.DEPOSIT,
        title: '¡Aporte de tu pareja!',
        body: `${partner?.name || 'Tu pareja'} aportó ${formatCurrency(amount)} a "${goal.name}".`,
        is_read: false,
        created_at: new Date().toISOString()
    });

    refresh();
  };

  return (
    <div className="space-y-6 pb-32 transition-theme">
      <Link to="/dashboard" className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
        ← Volver a Mis Metas
      </Link>

      {/* Goal Summary Card */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 overflow-hidden relative transition-theme">
        <div className="absolute top-0 right-0 p-6">
          <span className="text-6xl opacity-20 dark:opacity-30">{goal.emoji}</span>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Nuestra Meta</h2>
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100 mb-6">{goal.name}</h1>
          
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Progreso Total</span>
              <span className="text-pink-600 dark:text-pink-400 font-black text-3xl">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-5 overflow-hidden shadow-inner border border-gray-50 dark:border-gray-700">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-400 dark:from-pink-600 dark:to-rose-500 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pink-50 dark:bg-pink-950 p-5 rounded-3xl border border-pink-100 dark:border-pink-900 transition-theme">
              <span className="text-[10px] text-pink-400 dark:text-pink-500 uppercase font-black tracking-widest block mb-1">Recaudado</span>
              <span className="text-xl font-black text-pink-700 dark:text-pink-300">{formatCurrency(goal.current_amount)}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 transition-theme">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest block mb-1">Objetivo</span>
              <span className="text-xl font-black text-gray-700 dark:text-gray-200">{formatCurrency(goal.target_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Develop Mode: Partner Simulator */}
      {partnerId === 'virtual_partner_id' && (
        <div className="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-none border border-indigo-500 dark:border-indigo-800 relative overflow-hidden group transition-theme">
            <div className="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:scale-110 transition-transform">🤖</div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-black text-xs uppercase tracking-widest">Simulador de Pareja</h3>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-[8px] font-black uppercase">Modo Desarrollo</span>
              </div>
              <p className="text-xs text-indigo-100 dark:text-indigo-200 mb-4 font-medium italic leading-relaxed">¿Quieres ver cómo reacciona la meta a un aporte de tu pareja virtual?</p>
              <button 
                  onClick={simulatePartnerDeposit}
                  className="w-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all transform active:scale-95 shadow-lg"
              >
                  Simular Aporte de {partner?.name.split(' ')[0]}
              </button>
            </div>
        </div>
      )}

      {/* AI Advice */}
      <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-gray-900 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900 flex items-start gap-4 shadow-sm transition-theme">
        <div className="bg-white dark:bg-gray-800 w-14 h-14 rounded-2xl shadow-sm border border-indigo-50 dark:border-indigo-800 flex items-center justify-center text-3xl shrink-0">💡</div>
        <div className="pt-1">
            <h4 className="text-[10px] font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest mb-1">Coach Financiero AI</h4>
            {loadingAi ? (
                <div className="space-y-2 mt-2">
                    <div className="h-3 w-48 bg-indigo-100 dark:bg-indigo-900/40 animate-pulse rounded"></div>
                    <div className="h-3 w-32 bg-indigo-100 dark:bg-indigo-900/40 animate-pulse rounded"></div>
                </div>
            ) : (
                <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed font-medium italic">"{aiAdvice}"</p>
            )}
        </div>
      </div>

      {/* Action Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center transition-theme">
            <span className="text-3xl mb-2">⏳</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Días restantes</span>
            <span className="text-2xl font-black text-gray-800 dark:text-gray-100">{daysLeft}</span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center transition-theme">
            <span className="text-3xl mb-2">📅</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Ahorro Semanal</span>
            <span className="text-xl font-black text-gray-800 dark:text-gray-100">{formatCurrency(weekly)}</span>
        </div>
      </div>

      {/* Recent History */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm p-8 transition-theme">
        <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest text-[10px]">Aportes Recientes</h3>
            <button className="text-[10px] text-pink-600 dark:text-pink-400 font-black uppercase tracking-widest hover:underline">Ver todo</button>
        </div>
        
        <div className="space-y-6">
            {deposits.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-center text-gray-400 dark:text-gray-500 text-sm italic">Aún no hay depósitos.<br/>¡Sé el primero en aportar! 🚀</p>
                </div>
            ) : (
                deposits.slice(0, 5).map(d => {
                    const dUser = mockDb.getUser(d.user_id);
                    const isMe = d.user_id === user.id;
                    return (
                        <div key={d.id} className="flex items-center justify-between group transition-theme">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${isMe ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'}`}>
                                    {dUser?.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-800 dark:text-gray-100">{isMe ? 'Tú' : dUser?.name}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{new Date(d.created_at).toLocaleDateString('es-CO', {day: 'numeric', month: 'short'})}</p>
                                </div>
                            </div>
                            <span className="font-black text-lg text-gray-800 dark:text-gray-100">+{formatCurrency(d.amount)}</span>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
        <button 
          onClick={() => setShowDepositModal(true)}
          className="w-full bg-pink-600 text-white py-5 rounded-3xl font-black text-xl shadow-2xl shadow-pink-200 dark:shadow-none hover:bg-pink-700 dark:hover:bg-pink-500 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-b-4 border-pink-800"
        >
          <span>➕</span>
          <span>Aportar a esta Meta</span>
        </button>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 transition-theme">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3rem] p-10 animate-in slide-in-from-bottom duration-300 border-t dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 leading-tight">Ahorrar para:<br/><span className="text-pink-600 dark:text-pink-400">{goal.name}</span></h3>
                <button onClick={() => setShowDepositModal(false)} className="bg-gray-100 dark:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleDeposit} className="space-y-8">
                <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-300 dark:text-gray-700">$</span>
                    <input 
                        type="number" 
                        required
                        autoFocus
                        placeholder="0"
                        className="w-full pl-16 pr-6 py-10 text-5xl font-black text-pink-600 dark:text-pink-400 bg-gray-50 dark:bg-gray-950 rounded-[2.5rem] outline-none border-4 border-transparent focus:border-pink-100 dark:focus:border-pink-900 transition-all"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[50000, 100000, 200000].map(val => (
                        <button 
                            key={val}
                            type="button"
                            onClick={() => setDepositAmount(val)}
                            className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 py-4 rounded-2xl font-black text-gray-500 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-gray-700 hover:border-pink-200 dark:hover:border-pink-600 hover:text-pink-600 dark:hover:text-pink-400 transition-all shadow-sm"
                        >
                            +{val/1000}k
                        </button>
                    ))}
                </div>

                <button 
                    type="submit"
                    className="w-full bg-pink-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-pink-700 shadow-xl shadow-pink-200 dark:shadow-none transition-all border-b-4 border-pink-800"
                >
                    Confirmar Aporte 🚀
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDetail;
