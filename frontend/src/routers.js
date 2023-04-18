import * as React from 'react';
import {Auth} from "./helpers";
import {Navigate} from "react-router-dom";


export const ProtectedRoute = ({children}) => {
  const auth = new Auth();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" />
  }

  return children
}
