import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Calendar } from 'lucide-react';
import { Transaction } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useTransactions } from '../../hooks/useTransactions';

interface TransactionListProps {
  transactions: Transaction[];
  selectedDate?: Date;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, selectedDate }) => {
  const { user } = useAuth();
  const { deleteTransaction } = useTransactions(user?.uid);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const filteredTransactions = selectedDate
    ? transactions.filter(transaction => 
        transaction.date.toDateString() === selectedDate.toDateString()
      )
    : transactions;

  if (filteredTransactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {selectedDate ? 'No transactions for this date' : 'No transactions yet'}
        </h3>
        <p className="text-gray-500">
          {selectedDate 
            ? 'Select a different date or add a new transaction'
            : 'Start tracking your finances by adding your first transaction above'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedDate ? `Transactions for ${formatDate(selectedDate)}` : 'Recent Transactions'}
        </h3>
        <span className="text-sm text-gray-500">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <AnimatePresence>
        {filteredTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            layout
            className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{transaction.categoryEmoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {transaction.note}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {transaction.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`font-semibold text-lg ${
                    transaction.type === 'spent' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'spent' ? '-' : '+'}
                    {formatAmount(transaction.amount, user?.currency || 'USD')}
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTransaction(transaction.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;