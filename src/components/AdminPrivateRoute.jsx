import { Navigate } from 'react-router-dom';

export default function AdminPrivateRoute({ children }) {
  const isAdminAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  return isAdminAuthenticated ? children : <Navigate to='/admin/login' />;
}