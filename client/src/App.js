import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar   from './components/common/Navbar';
import Footer   from './components/common/Footer';

import HomePage           from './pages/HomePage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DashboardPage      from './pages/DashboardPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import WorkoutPlansPage   from './pages/WorkoutPlansPage';
import WorkoutDetailPage  from './pages/WorkoutDetailPage';
import ProgressPage       from './pages/ProgressPage';
import CalculatorPage     from './pages/CalculatorPage';
import ProfilePage        from './pages/ProfilePage';
import NotFoundPage       from './pages/NotFoundPage';

const Loader = () => (
  <div className="loading-screen">
    <div className="loading-ring" />
    <p style={{ fontFamily:'var(--ff-display)', color:'var(--cyan)', fontSize:'0.65rem', letterSpacing:'0.2em' }}>
      INITIALIZING AURAFIT
    </p>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/"           element={<HomePage />} />
      <Route path="/login"      element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"   element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/exercises"  element={<ExerciseLibraryPage />} />
      <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
      <Route path="/workouts"   element={<WorkoutPlansPage />} />
      <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/progress"   element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
      <Route path="/profile"    element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="*"           element={<NotFoundPage />} />
    </Routes>
    <Footer />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-1)',
              border: '1px solid var(--border-glow)',
              fontFamily: 'var(--ff-body)',
              borderRadius: '4px'
            },
            success: { iconTheme: { primary: 'var(--green)',  secondary: 'var(--bg-void)' } },
            error:   { iconTheme: { primary: 'var(--red)',    secondary: 'var(--bg-void)' } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}
