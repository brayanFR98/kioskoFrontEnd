import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Verifica si hay un token en localStorage

  return token ? children : <Navigate to="/login" />; // Si hay token, renderiza el componente hijo, sino redirige a /login
};

export default PrivateRoute;
