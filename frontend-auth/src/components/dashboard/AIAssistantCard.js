import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const AIAssistantCard = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 shadow-lg shadow-indigo-500/20"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-400 opacity-20 rounded-full blur-xl"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-amber-300" />
            <h3 className="font-semibold text-indigo-50">AI Assistant</h3>
          </div>
          
          <p className="text-lg font-medium leading-tight mb-2">
            This project may be delayed by <span className="text-amber-300 font-bold">4 days</span> based on current progress.
          </p>
          <p className="text-indigo-200 text-sm mb-6">
            Backend integration is moving slower than historical averages.
          </p>
        </div>
        
        <button className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-between w-full group">
          <span>View Insights & Recommendations</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Robot illustration placeholder (could be an actual image) */}
      <div className="absolute right-[-10%] top-[20%] opacity-20 pointer-events-none hidden xl:block">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      </div>
    </motion.div>
  );
};

export default AIAssistantCard;
