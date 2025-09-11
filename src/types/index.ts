export interface User {
  uid: string;
  name: string;
  email: string;
  currency: string;
  photoURL?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'spent' | 'received';
  note: string;
  date: Date;
  category: string;
  categoryEmoji: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  isDefault: boolean;
  userId: string;
}

export interface DailySummary {
  date: string;
  totalSpent: number;
  totalReceived: number;
  transactionCount: number;
}