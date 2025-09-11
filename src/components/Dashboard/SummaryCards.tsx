import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Calendar, Loader2 } from 'lucide-react';
import { Transaction } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface SummaryCardsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions, loading = false }) => {
  const { user } = useAuth();

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount));
  };

  const summaryData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const calculateSummary = (filterDate: Date) => {
      const filtered = transactions.filter((t: Transaction) => {
        const transactionDate = t.date instanceof Date ? t.date : new Date(t.date);
        return transactionDate >= filterDate;
      });
      
      const spent = filtered
        .filter((t: Transaction) => t.type === 'spent')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      
      const received = filtered
        .filter((t: Transaction) => t.type === 'received')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      
      return { spent, received, net: received - spent };
    };

    return {
      today: calculateSummary(today),
      month: calculateSummary(thisMonth),
      year: calculateSummary(thisYear)
    };
  }, [transactions]);

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: item * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'Today',
      icon: Calendar,
      data: summaryData.today,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'This Month',
      icon: TrendingUp,
      data: summaryData.month,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'This Year',
      icon: Wallet,
      data: summaryData.year,
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {summaryCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <div className={`bg-gradient-to-br ${card.gradient} p-2 rounded-lg`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Received</span>
              <span className="text-sm font-medium text-green-600">
                +{formatAmount(card.data.received, user?.currency || 'USD')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Spent</span>
              <span className="text-sm font-medium text-red-600">
                -{formatAmount(card.data.spent, user?.currency || 'USD')}
              </span>
            </div>
            
            <hr className="my-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Net</span>
              <div className="flex items-center space-x-1">
                {card.data.net >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-lg font-bold ${
                  card.data.net >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.data.net >= 0 ? '+' : ''}
                  {formatAmount(card.data.net, user?.currency || 'USD')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;