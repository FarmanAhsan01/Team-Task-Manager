import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { SocketProvider } from './contexts/SocketContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated && token) {
      const fetchTeams = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/v1/teams', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success) {
            import('./store/slices/workspaceSlice').then(slice => {
              dispatch(slice.setTeams(data.data));
            });
          }
        } catch (err) {
          console.error('Failed to fetch teams', err);
        }
      };
      fetchTeams();
    }
  }, [isAuthenticated, token, dispatch]);

  const handleLogin = () => {
    // Legacy support for passing prop down, but actual state is managed by Redux
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={
          isAuthenticated ? (
            <SocketProvider>
              <DashboardLayout />
            </SocketProvider>
          ) : <Navigate to="/login" />
        }>
          <Route path="/dashboard" element={<DashboardPage onLogout={handleLogout} />} />
          {/* Add more protected routes here later */}
          <Route path="/projects" element={<div className="p-8">Projects Page (Coming Soon)</div>} />
          <Route path="/tasks" element={<div className="p-8">Tasks Page (Coming Soon)</div>} />
          <Route path="/board" element={<div className="p-8">Kanban Board (Coming Soon)</div>} />
          <Route path="/calendar" element={<div className="p-8">Calendar (Coming Soon)</div>} />
          <Route path="/teams" element={<div className="p-8">Teams Page (Coming Soon)</div>} />
          <Route path="/analytics" element={<ReportsPage />} />
          <Route path="/notifications" element={<div className="p-8">Notifications</div>} />
          <Route path="/settings" element={<div className="p-8">Settings</div>} />
        </Route>

        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
