import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction } from '../types';
import toast from 'react-hot-toast';

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionData: Transaction[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        transactionData.push({
          id: doc.id,
          ...data,
          date: data.date.toDate()
        } as Transaction);
      });
      setTransactions(transactionData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId,
        date: Timestamp.fromDate(transaction.date)
      });
      toast.success('Transaction added successfully!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      throw error;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
      toast.success('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
      throw error;
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction
  };
};