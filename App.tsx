
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { User, Couple, Goal } from './types';
import { mockDb } from './lib/mockDb';

// Views
import Login from './views/Login';
import Signup from './views/Signup';
import Dashboard from './views/Dashboard';
import GoalDetail from './views/GoalDetail';
import Pairing from './views/Pairing';
import GoalSetup from './views/GoalSetup';
import ProfileSetup from './views/ProfileSetup';
import Settings from './views/Settings';

// Layout Components
import Navbar from './components/Navbar';

const GoalDetailWrapper: React.FC<{ user: User; couple: Couple; refresh: () => void }> = ({ user, couple, refresh }) => {
  const { goalId } = useParams();
  const goal = mockDb.getGoal(goalId || '');
  if (!goal) return <Navigate to="/dashboard" />;
  return <GoalDetail user={user} couple={couple} goal={goal} refresh={refresh} />;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(() => {
    if (user) {
      const c = mockDb.getCoupleForUser(user.id);
      setCouple(c || null);
    }
  }, [user]);

  useEffect(() => {
    const savedUserId = localStorage.getItem('logged_in_user_id');
    if (savedUserId) {
      const u = mockDb.getUser(savedUserId);
      if (u) {
        setUser(u);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [user, refreshData]);

  const handleLogin = (u: User) => {
    localStorage.setItem('logged_in_user_id', u.id);
    setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('logged_in_user_id');
    setUser(null);
    setCouple(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-gray-900 transition-theme">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 dark:border-pink-400"></div>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-theme pb-12">
        {user && <Navbar user={user} handleLogout={handleLogout} />}
        <main className="max-w-md mx-auto px-4 pt-4">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup onSignup={handleLogin} /> : <Navigate to="/profile-setup" />} 
            />
            <Route 
              path="/profile-setup" 
              element={user ? <ProfileSetup user={user} onComplete={refreshData} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/pairing" 
              element={user ? (couple ? <Navigate to="/dashboard" /> : <Pairing user={user} onComplete={refreshData} />) : <Navigate to="/login" />} 
            />
            <Route 
              path="/goal-setup" 
              element={user && couple ? <GoalSetup couple={couple} creatorId={user.id} onComplete={refreshData} /> : <Navigate to="/pairing" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? (couple ? <Dashboard user={user} couple={couple} refresh={refreshData} /> : <Navigate to="/pairing" />) : <Navigate to="/login" />} 
            />
            <Route 
              path="/goal/:goalId" 
              element={user && couple ? <GoalDetailWrapper user={user} couple={couple} refresh={refreshData} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings user={user} couple={couple} onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
