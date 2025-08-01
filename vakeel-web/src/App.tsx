import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './assets/styles/theme';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientDashboard from './pages/ClientDashboard';
import ClientRequests from './pages/ClientRequests';
import LawyerClientRequests from './pages/LawyerClientRequests';
import PostMatter from './pages/PostMatter';
import MyMatters from './pages/MyMatters';
import LawyerMatters from './pages/LawyerMatters';
import AddRequest1 from './pages/AddRequest1';
import AddRequest2 from './pages/AddRequest2';
import AddRequest3 from './pages/AddRequest3';
import Cases from './pages/Cases';
import Chat from './pages/Chat';
import LawyerProfile from './pages/LawyerProfile';
import ClientProfile from './pages/ClientProfile';
import MatterDetail from './pages/MatterDetail';
import Layout from './components/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            {user?.user_type === 'client' ? <ClientDashboard /> : <Dashboard />}
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-requests" element={
        <ProtectedRoute>
          <Layout><ClientRequests /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/client-requests" element={
        <ProtectedRoute>
          <Layout><LawyerClientRequests /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/post-matter" element={
        <ProtectedRoute>
          <Layout><PostMatter /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-matters" element={
        <ProtectedRoute>
          <Layout><MyMatters /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/lawyer-matters" element={
        <ProtectedRoute>
          <Layout><LawyerMatters /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/add-request-1" element={
        <ProtectedRoute>
          <Layout><AddRequest1 /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/add-request-2" element={
        <ProtectedRoute>
          <Layout><AddRequest2 /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/add-request-3" element={
        <ProtectedRoute>
          <Layout><AddRequest3 /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/cases" element={
        <ProtectedRoute>
          <Layout><Cases /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <Layout><Chat /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/lawyer-profile/:id" element={
        <ProtectedRoute>
          <Layout><LawyerProfile /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/client-profile/:id" element={
        <ProtectedRoute>
          <Layout><ClientProfile /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/matter-detail/:id" element={
        <ProtectedRoute>
          <Layout><MatterDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 