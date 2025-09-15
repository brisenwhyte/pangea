// Dashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../Layout/Header';
import TransactionForm from '../Transactions/TransactionForm'; // Make sure this import is correct
import TransactionList from '../Transactions/TransList';
import SummaryCards from './SummaryCards';
import CalendarView from './CalendarView';
import CategoryManager from '../Categories/CategoryManager';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions, loading, addTransaction } = useTransactions(user?.uid);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Track your finances and take control of your money
            </p>
          </div>

          {/* Summary Cards */}
          <SummaryCards transactions={transactions} loading={loading} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <TransactionForm addTransaction={addTransaction} />
              <CategoryManager />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <CalendarView 
                transactions={transactions}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
          </div>

          {/* Transaction List - Full Width */}
          <div className="h-96 overflow-y-auto custom-scrollbar">
            <TransactionList 
              transactions={transactions}
              selectedDate={selectedDate || undefined}
            />
          </div>
        </motion.div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5c5c5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;