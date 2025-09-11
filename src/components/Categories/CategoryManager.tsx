import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tags } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const CategoryManager: React.FC = () => {
  const { user } = useAuth();
  const { categories, addCategory } = useCategories(user?.uid);
  
  const [showForm, setShowForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📁');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast.error('Category already exists');
      return;
    }

    setLoading(true);
    try {
      await addCategory(newCategoryName.trim(), selectedEmoji);
      setNewCategoryName('');
      setSelectedEmoji('📁');
      setShowForm(false);
      setShowEmojiPicker(false);
      toast.success('Category added successfully!');
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const customCategories = categories.filter(cat => !cat.isDefault);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
            <Tags className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Category</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-xl hover:bg-gray-50 transition-colors"
                    >
                      {selectedEmoji}
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="absolute top-14 left-0 z-50">
                        <EmojiPicker
                          onEmojiClick={(emojiObject) => {
                            setSelectedEmoji(emojiObject.emoji);
                            setShowEmojiPicker(false);
                          }}
                          width={300}
                          height={350}
                        />
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setShowEmojiPicker(false);
                      setNewCategoryName('');
                      setSelectedEmoji('📁');
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Default Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {categories.filter(cat => cat.isDefault).map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 rounded-lg p-3 text-center"
              >
                <div className="text-xl mb-1">{category.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{category.name}</div>
              </div>
            ))}
          </div>
        </div>

        {customCategories.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Custom Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {customCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center"
                >
                  <div className="text-xl mb-1">{category.emoji}</div>
                  <div className="text-sm font-medium text-orange-700">{category.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryManager;