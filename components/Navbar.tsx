
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Notification } from '../types';
import { mockDb } from '../lib/mockDb';

interface Props {
  user: User;
  handleLogout: () => void;
}

const Navbar: React.FC<Props> = ({ user, handleLogout }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const location = useLocation();
  const notifications = mockDb.getNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const markRead = (id: string) => {
    mockDb.markRead(id);
    setShowNotifs(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm flex items-center justify-between transition-theme">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="text-2xl">❤️</span>
        <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">Meta Pareja</span>
      </Link>
      
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 overflow-hidden max-h-96 overflow-y-auto z-50 transition-theme">
              <h3 className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">Notificaciones</h3>
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">Todo al día por aquí ✨</p>
              ) : (
                notifications.map(n => (
                  <button 
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 transition-colors ${!n.is_read ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.body}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <Link to="/settings" className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${location.pathname === '/settings' ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' : 'text-gray-600 dark:text-gray-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
