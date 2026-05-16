import React from 'react';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    user: 'Rahul',
    avatar: 'R',
    color: 'bg-blue-500',
    action: 'completed',
    target: 'API Integration',
    time: '2 min ago',
    type: 'success'
  },
  {
    id: 2,
    user: 'Aman',
    avatar: 'A',
    color: 'bg-emerald-500',
    action: 'moved',
    target: 'Bug Fixes',
    to: 'Testing',
    time: '15 min ago',
    type: 'status'
  },
  {
    id: 3,
    user: 'Priya',
    avatar: 'P',
    color: 'bg-purple-500',
    action: 'uploaded',
    target: 'design-v2.pdf',
    time: '1 hour ago',
    type: 'file'
  },
  {
    id: 4,
    user: 'You',
    avatar: 'Y',
    color: 'bg-brand-500',
    action: 'assigned',
    target: 'Database Setup',
    to: 'Rahul',
    time: '2 hours ago',
    type: 'assign'
  }
];

const ActivityFeed = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 rounded-2xl h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-800 dark:text-white">Activity Feed</h3>
        <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors">View All</button>
      </div>
      
      <div className="relative">
        {/* Vertical line connecting timeline items */}
        <div className="absolute top-4 bottom-4 left-4 w-px bg-slate-200 dark:bg-slate-700"></div>
        
        <div className="space-y-6">
          {activities.map((activity, i) => (
            <div key={activity.id} className="relative flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center text-white text-xs font-bold ring-4 ring-white dark:ring-[#1E293B] z-10 shrink-0`}>
                {activity.avatar}
              </div>
              
              <div className="flex-1 pt-1.5 min-w-0">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-white">{activity.user}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium text-slate-800 dark:text-white">{activity.target}</span>
                  {activity.to && (
                    <>
                      {' '}to <span className="font-medium text-slate-800 dark:text-white">{activity.to}</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
