import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AntdProvider from './shared/components/AntdProvider';
import Login from './features/auth/Login'; 
import Dashboard from './features/tasks/Dashboard';
import ProtectedRoute from './shared/components/ProtectedRoute';
import PublicRoute from './shared/components/PublicRoute';

function App() {
  return (
    <ThemeProvider>
      <AntdProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AntdProvider>
    </ThemeProvider>
  );
}

export default App;
