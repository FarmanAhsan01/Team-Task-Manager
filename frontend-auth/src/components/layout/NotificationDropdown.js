import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../contexts/SocketContext';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'assignment', text: 'You were assigned to Database Setup', time: '10m ago', unread: true },
    { id: 2, type: 'mention', text: 'Rahul mentioned you in API Integration', time: '1h ago', unread: true },
  ]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type) => {
    switch(type) {
      case 'assignment': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'mention': return <MessageSquare size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-amber-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1E293B] animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
              <button 
                onClick={() => setNotifications(prev => prev.map(n => ({...n, unread: false})))}
                className="text-xs text-brand-500 hover:text-brand-600 font-medium"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">No new notifications</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${notif.unread ? 'bg-brand-50/30 dark:bg-brand-500/5' : ''}`}>
                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                    <div>
                      <p className={`text-sm ${notif.unread ? 'text-slate-800 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                        {notif.text}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                View All Activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
