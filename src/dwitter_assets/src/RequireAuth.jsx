import React, { useContext } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from './AuthContext';

const RequireAuth = props => {
    const {authCtx, setAuthCtx} = useContext(AuthContext);
    const location = useLocation();
  
    if (!authCtx) {
      // Redirect them to the / page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  
    return props.children;
}

export default RequireAuth;