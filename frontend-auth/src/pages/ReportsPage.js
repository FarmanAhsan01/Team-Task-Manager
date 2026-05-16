import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, TrendingUp, Award, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ReportsPage = () => {
  const { activeTeam } = useSelector((state) => state.workspace);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!activeTeam) return;
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:5000/api/v1/teams/${activeTeam.id}/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(response.data.data);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [activeTeam]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/dashboard" className="text-sm font-medium text-brand-500 flex items-center gap-1 mb-2 hover:underline">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Team Progress Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed performance metrics for {activeTeam?.name || 'your team'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Productivity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-500" />
              Productivity by Employee (%)
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="productivity" radius={[6, 6, 0, 0]} barSize={40}>
                  {reports.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h3 className="font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            Top Performers
          </h3>
          <div className="space-y-4">
            {reports.sort((a, b) => b.productivity - a.productivity).slice(0, 4).map((employee, i) => (
              <div key={employee.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {employee.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{employee.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{employee.completed} tasks completed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-500">{employee.productivity}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Employee Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-brand-500" />
            Detailed Employee Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Tasks</th>
                <th className="px-6 py-4">Completed</th>
                <th className="px-6 py-4">Active</th>
                <th className="px-6 py-4">Overdue</th>
                <th className="px-6 py-4 text-right">Productivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {employee.name[0]}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">ACTIVE</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{employee.completed + employee.active}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{employee.completed}</td>
                  <td className="px-6 py-4 text-sm text-brand-600 dark:text-brand-400 font-semibold">{employee.active}</td>
                  <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400 font-semibold">{employee.overdue}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${employee.productivity}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{employee.productivity}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
