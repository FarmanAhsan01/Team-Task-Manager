import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, Moon, Sun, ArrowLeftRight, LogOut } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ProjectModal from '../dashboard/ProjectModal';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const TopNavbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isDark, setIsDark] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors duration-200 shadow-sm z-20 relative">
      <div className="flex items-center gap-4 flex-1">
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors lg:hidden">
          <ArrowLeftRight size={20} />
        </button>
        
        <div className="relative max-w-md w-full hidden sm:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, projects, people..."
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 shadow-sm">⌘</span>
            <span className="text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 shadow-sm">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsProjectModalOpen(true)}
          className="btn-primary py-1.5 px-4 rounded-full text-sm font-medium hidden sm:flex"
        >
          <Plus size={16} />
          Create
        </button>

        <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 pr-4 mr-1">
          <NotificationDropdown />
          <button className="p-2 text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all">
            <MessageSquare size={20} />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-[#1E293B] group-hover:ring-brand-100 dark:group-hover:ring-brand-900/30 transition-all shrink-0">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight truncate max-w-[100px]">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role || 'Member'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-all ml-2"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
      />
    </header>
  );
};

export default TopNavbar;
