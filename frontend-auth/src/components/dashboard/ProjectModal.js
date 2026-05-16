import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Calendar, AlignLeft, Users } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setProjects } from '../../store/slices/workspaceSlice';

const ProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { teams, activeTeam } = useSelector((state) => state.workspace);
  const starterTeams = [
    { id: 'mock-1', name: 'Engineering Alpha' },
    { id: 'mock-2', name: 'Design Systems' },
    { id: 'mock-3', name: 'Product Strategy' },
    { id: 'mock-4', name: 'Marketing Hub' }
  ];

  const displayTeams = teams.length > 0 ? teams : starterTeams;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamId: activeTeam?.id || (displayTeams.length > 0 ? displayTeams[0].id : ''),
    deadline: ''
  });

  // Sync with available teams
  React.useEffect(() => {
    if (teams.length > 0 && !formData.teamId) {
      setFormData(prev => ({ ...prev, teamId: activeTeam?.id || teams[0].id }));
    }
  }, [teams, activeTeam, formData.teamId]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://127.0.0.1:5000/api/v1/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Set the new project as active so dashboard updates
        import('../../store/slices/workspaceSlice').then(slice => {
          dispatch(slice.setActiveProject(response.data.data));
        });
      }

      onClose();
      setFormData({ name: '', description: '', teamId: activeTeam?.id || '', deadline: '' });
    } catch (err) {
      console.error('Project creation error:', err);
      const message = err.response?.data?.message || err.message || 'Failed to create project';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Content */}
          {/* Modal Wrapper for Centering */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-800/50 relative shrink-0">
                <button onClick={onClose} className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <X size={20} />
                </button>
                
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
                  <Briefcase size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">Create New Project</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Launch a new workspace for your team</p>
              </div>

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Project Name</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <Briefcase size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Q3 Marketing Sprint"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Team</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <Users size={18} />
                  </div>
                  <select
                    required
                    value={formData.teamId}
                    onChange={(e) => setFormData({...formData, teamId: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white appearance-none"
                  >
                    <option value="" disabled>Choose a team</option>
                    {displayTeams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <AlignLeft size={18} />
                  </div>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="What is this project about?"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white resize-none"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deadline</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 shadow-lg shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>
  );
};

export default ProjectModal;
