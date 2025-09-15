import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className=" rounded-lg">
              {/* <Wallet className="h-6 w-6 text-white" /> */}
              <img src="/PANGEA.png" alt="" className='h-8 w-8 object-cover' />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pangea</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL ?? undefined} 
                    alt={user.name ?? undefined}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;