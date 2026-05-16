import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, trend, isPositive, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
        </div>
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 group-hover:scale-110 group-hover:text-brand-500 transition-all">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 mt-4">
        <span className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${
          isPositive 
            ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
          {trend}
        </span>
        <span className="text-xs text-slate-400 font-medium">from last week</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
