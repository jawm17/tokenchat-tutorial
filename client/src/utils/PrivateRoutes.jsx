import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
    return(
      isAuthenticated ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoutes
