import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  setDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Category } from '../types';

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'userId'>[] = [
  { name: 'Groceries', emoji: '🛒', isDefault: true },
  { name: 'Transport', emoji: '🚌', isDefault: true },
  { name: 'Food', emoji: '🍔', isDefault: true },
  { name: 'Entertainment', emoji: '🎬', isDefault: true },
  { name: 'Bills', emoji: '🧾', isDefault: true },
  { name: 'Shopping', emoji: '🛍️', isDefault: true },
  { name: 'Healthcare', emoji: '🏥', isDefault: true },
  { name: 'Education', emoji: '📚', isDefault: true }
];

export const useCategories = (userId: string | undefined) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'categories'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const categoryData: Category[] = [];
      snapshot.forEach((doc) => {
        categoryData.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      });

      // If no categories exist, create default ones
      if (categoryData.length === 0) {
        for (const defaultCategory of DEFAULT_CATEGORIES) {
          const docRef = await addDoc(collection(db, 'categories'), {
            ...defaultCategory,
            userId
          });
          categoryData.push({
            id: docRef.id,
            ...defaultCategory,
            userId
          });
        }
      }

      setCategories(categoryData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addCategory = async (name: string, emoji: string) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, 'categories'), {
        name,
        emoji,
        isDefault: false,
        userId
      });
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  return {
    categories,
    loading,
    addCategory
  };
};