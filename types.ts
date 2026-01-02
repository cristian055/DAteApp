
export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

export enum NotificationType {
  DEPOSIT = 'deposit',
  GOAL_COMPLETED = 'goal_completed',
  PARTNER_JOINED = 'partner_joined'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  currency: string;
}

export interface Couple {
  id: string;
  user_a_id: string;
  user_b_id: string;
  paired_at: string;
}

export interface Goal {
  id: string;
  couple_id: string;
  created_by_id: string;
  name: string;
  emoji: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  status: GoalStatus;
  created_at: string;
}

export interface Deposit {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}
