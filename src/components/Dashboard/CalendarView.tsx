import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { CalendarDays } from 'lucide-react';
import { Transaction } from '../../types';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  transactions: Transaction[];
  onDateSelect: (date: Date | null) => void;
  selectedDate: Date | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  transactions, 
  onDateSelect, 
  selectedDate 
}) => {
  const [calendarValue, setCalendarValue] = useState(new Date());

  const getTransactionsForDate = (date: Date) => {
    return transactions.filter(transaction => 
      transaction.date.toDateString() === date.toDateString()
    );
  };

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayTransactions = getTransactionsForDate(date);
      if (dayTransactions.length > 0) {
        const totalSpent = dayTransactions
          .filter(t => t.type === 'spent')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalReceived = dayTransactions
          .filter(t => t.type === 'received')
          .reduce((sum, t) => sum + t.amount, 0);
        const net = totalReceived - totalSpent;
        
        return (
          <div className="flex flex-col items-center mt-1">
            <div className={`w-2 h-2 rounded-full ${
              net >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs font-medium text-gray-600">
              {dayTransactions.length}
            </span>
          </div>
        );
      }
    }
    return null;
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setCalendarValue(value);
      if (selectedDate && value.toDateString() === selectedDate.toDateString()) {
        onDateSelect(null); // Deselect if clicking the same date
      } else {
        onDateSelect(value);
      }
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
          <CalendarDays className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Calendar View</h2>
      </div>

      <div className="calendar-container">
        <Calendar
          value={calendarValue}
          onChange={handleDateChange}
          tileContent={getTileContent}
          className="react-calendar-custom"
          tileClassName={({ date }) => {
            if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
              return 'selected-date';
            }
            const dayTransactions = getTransactionsForDate(date);
            return dayTransactions.length > 0 ? 'has-transactions' : '';
          }}
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Legend:</h4>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Positive net</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Negative net</span>
          </div>
        </div>
      </div>

      {selectedDate && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4 p-4 bg-white rounded-lg shadow border"
  >
    <h3 className="font-medium text-gray-900 mb-3">
      Transactions on {selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </h3>

    {getTransactionsForDate(selectedDate).length === 0 ? (
      <p className="text-sm text-gray-600">No transactions for this day.</p>
    ) : (
      <ul className="space-y-3">
        {getTransactionsForDate(selectedDate).map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{t.categoryEmoji}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{t.category}</p>
                <p className="text-xs text-gray-500">{t.note}</p>
              </div>
            </div>
            <div
              className={`text-sm font-semibold ${
                t.type === 'received' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {t.type === 'received' ? '+' : '-'}₹{t.amount}
            </div>
          </li>
        ))}
      </ul>
    )}
  </motion.div>
)}
    </motion.div>
  );
};

export default CalendarView;