import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Clock, Activity, MoreHorizontal, Plus, CheckCircle, User } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import AIAssistantCard from '../components/dashboard/AIAssistantCard';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TaskModal from '../components/dashboard/TaskModal';
import { useSelector } from 'react-redux';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { activeProject } = useSelector((state) => state.workspace);
  const socket = useSocket();
  const [realStats, setRealStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (socket && activeProject) {
      const roomId = `project_${activeProject.id}`;
      socket.emit('joinRoom', roomId);
      console.log(`Joined room: ${roomId}`);
    }
  }, [socket, activeProject]);

  useEffect(() => {
    if (socket) {
      socket.on('taskUpdated', () => setRefreshTrigger(prev => prev + 1));
      socket.on('taskCreated', () => setRefreshTrigger(prev => prev + 1));
      return () => {
        socket.off('taskUpdated');
        socket.off('taskCreated');
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (isAdmin && activeProject) {
          console.log('Fetching stats for project:', activeProject.id);
          const response = await axios.get(`http://127.0.0.1:5000/api/v1/projects/${activeProject.id}/stats?cb=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Stats full response:', response.data);
          setRealStats(response.data.data);
        } else if (!isAdmin) {
          console.log('Fetching tasks for member');
          const response = await axios.get(`http://127.0.0.1:5000/api/v1/tasks/me?cb=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyTasks(response.data.data);
        }
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeProject, isAdmin, refreshTrigger]);

  const handleCompleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`http://127.0.0.1:5000/api/v1/tasks/${taskId}/status`, 
        { status: 'COMPLETED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setMyTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
      // Force refresh for admin if they are on the same machine
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to complete task', err);
    }
  };

  const stats = [
    { 
      title: 'Total Tasks', 
      value: realStats ? realStats.total.toString() : (loading ? '...' : '0'), 
      trend: realStats ? 'New' : '18%', 
      isPositive: true, 
      icon: <CalendarDays size={20} /> 
    },
    { 
      title: 'Completed', 
      value: realStats ? realStats.completed.toString() : (loading ? '...' : '0'), 
      trend: realStats ? 'New' : '24%', 
      isPositive: true, 
      icon: <CheckCircle2 size={20} /> 
    },
    { 
      title: 'In Progress', 
      value: realStats ? realStats.inProgress.toString() : (loading ? '...' : '0'), 
      trend: realStats ? 'New' : '5%', 
      isPositive: true, 
      icon: <Activity size={20} /> 
    },
    { 
      title: 'Overdue', 
      value: realStats ? realStats.overdue.toString() : (loading ? '...' : '0'), 
      trend: realStats ? 'New' : '8%', 
      isPositive: false, 
      icon: <Clock size={20} /> 
    },
  ];

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            You are logged in as a **Member**. Here are your assigned tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-brand-500" /> My To-Do List
            </h3>
            
            {myTasks.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400">No tasks assigned to you yet. Good job!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-brand-50 text-brand-600'}`}>
                        {task.status === 'COMPLETED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <User size={12} /> Assigned by Admin: <span className="font-medium text-brand-600">{task.creator?.name || 'Admin'}</span>
                        </p>
                      </div>
                    </div>
                    
                    {task.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => handleCompleteTask(task.id)}
                        className="px-4 py-2 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <AIAssistantCard delay={0.3} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      {/* Admin Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Admin Dashboard <span className="text-brand-500">Live</span> ⚡
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name}! You are managing **{activeProject?.name || 'All Projects'}**.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95"
          >
            <Plus size={18} /> Assign Task
          </button>
          
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg shadow-sm">
            <CalendarDays size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">May 20 - May 26, 2026</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Main Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} delay={0.1 * (index + 1)} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="h-[350px]">
            <ProductivityChart delay={0.5} />
          </div>
        </div>

        {/* Sidebar Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AIAssistantCard delay={0.3} />
          <div className="flex-1 min-h-[350px]">
            <ActivityFeed delay={0.6} />
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  );
};

export default DashboardPage;
