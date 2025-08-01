
import { motion } from 'framer-motion';
import { RefreshCw, Settings } from 'lucide-react';

interface EndOfMatchesScreenProps {
  onRestart: () => void;
  onUpdateFilters: () => void;
}

const EndOfMatchesScreen = ({ onRestart, onUpdateFilters }: EndOfMatchesScreenProps) => {
  return (
    <div className="min-h-screen bg-black text-white font-inter flex flex-col items-center justify-center space-y-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <span className="text-4xl">🏠</span>
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">You've reached the end of your dream-home matches</h1>
          <p className="text-white/70 text-lg">
            No more properties match your current criteria.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 w-full max-w-md"
      >
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors flex items-center justify-center space-x-3 font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          <span>See them again</span>
        </motion.button>
        
        <motion.button
          onClick={onUpdateFilters}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-4 border border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl transition-colors flex items-center justify-center space-x-3 font-medium"
        >
          <Settings className="w-5 h-5" />
          <span>Change your filters</span>
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-white/50 text-center max-w-md"
      >
        New listings appear daily. We'll keep watching the market for you and notify you when new matches are found.
      </motion.p>
    </div>
  );
};

export default EndOfMatchesScreen;
