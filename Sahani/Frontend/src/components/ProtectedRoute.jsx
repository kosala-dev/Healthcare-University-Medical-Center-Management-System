// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthCheck from '../hooks/useAuthCheck';

// allowedRoles should be an array, e.g., ['Doctor', 'SuperAdmin']
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { designation, isLoading } = useAuthCheck();

    if (isLoading) {
        // You can return a loading spinner component here
        return <div>Loading user credentials...</div>;
    }
    
    // 1. Check if the user is logged in (designation is set)
    if (!designation) {
        // Redirect to the login page if not authenticated
        return <Navigate to="/login" replace />; 
    }

    // 2. Check if the user's designation is in the allowedRoles array
    if (allowedRoles.includes(designation)) {
        return children;
    }
    
    // 3. If authenticated but role is wrong, show access denied or redirect
    return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;