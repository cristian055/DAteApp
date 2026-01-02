
import { User, Couple, Goal, Deposit, Notification, GoalStatus, NotificationType } from '../types';

const STORAGE_KEY = 'meta_pareja_db';

interface DB {
  users: User[];
  couples: Couple[];
  goals: Goal[];
  deposits: Deposit[];
  notifications: Notification[];
  invites: { code: string; inviterId: string; expiresAt: string }[];
}

const getDB = (): DB => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial: DB = { users: [], couples: [], goals: [], deposits: [], notifications: [], invites: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveDB = (db: DB) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const mockDb = {
  // Users
  getUser: (id: string) => getDB().users.find(u => u.id === id),
  findUserByEmail: (email: string) => getDB().users.find(u => u.email === email),
  createUser: (user: User) => {
    const db = getDB();
    const existingIdx = db.users.findIndex(u => u.id === user.id);
    if (existingIdx > -1) db.users[existingIdx] = user;
    else db.users.push(user);
    saveDB(db);
    return user;
  },

  // Couples
  getCoupleForUser: (userId: string) => getDB().couples.find(c => c.user_a_id === userId || c.user_b_id === userId),
  createCouple: (userA: string, userB: string) => {
    const db = getDB();
    const couple: Couple = {
      id: Math.random().toString(36).substr(2, 9),
      user_a_id: userA,
      user_b_id: userB,
      paired_at: new Date().toISOString()
    };
    db.couples.push(couple);
    saveDB(db);
    return couple;
  },

  // Invites
  createInvite: (inviterId: string) => {
    const db = getDB();
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    db.invites.push({ code, inviterId, expiresAt });
    saveDB(db);
    return code;
  },
  consumeInvite: (code: string) => {
    const db = getDB();
    const idx = db.invites.findIndex(i => i.code === code);
    if (idx === -1) return null;
    const invite = db.invites[idx];
    if (new Date(invite.expiresAt) < new Date()) {
        db.invites.splice(idx, 1);
        saveDB(db);
        return null;
    }
    db.invites.splice(idx, 1);
    saveDB(db);
    return invite;
  },

  // Goals
  getGoals: (coupleId: string) => getDB().goals.filter(g => g.couple_id === coupleId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  getGoal: (goalId: string) => getDB().goals.find(g => g.id === goalId),
  createGoal: (goal: Goal) => {
    const db = getDB();
    db.goals.push(goal);
    saveDB(db);
    return goal;
  },

  // Deposits
  getDepositsForGoal: (goalId: string) => getDB().deposits.filter(d => d.goal_id === goalId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createDeposit: (deposit: Deposit) => {
    const db = getDB();
    db.deposits.push(deposit);
    // Update goal current amount
    const goal = db.goals.find(g => g.id === deposit.goal_id);
    if (goal) goal.current_amount += deposit.amount;
    saveDB(db);
    return deposit;
  },

  // Notifications
  getNotifications: (userId: string) => getDB().notifications.filter(n => n.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createNotification: (notif: Notification) => {
    const db = getDB();
    db.notifications.push(notif);
    saveDB(db);
  },
  markRead: (id: string) => {
    const db = getDB();
    const n = db.notifications.find(item => item.id === id);
    if (n) n.is_read = true;
    saveDB(db);
  }
};
