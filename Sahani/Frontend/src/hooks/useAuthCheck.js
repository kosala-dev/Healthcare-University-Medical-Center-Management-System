// src/hooks/useAuthCheck.js

import { useState, useEffect } from 'react';

const useAuthCheck = () => {
    const [designation, setDesignation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Retrieve the logged-in user's data (must contain the 'designation' field)
        const adminInfo = localStorage.getItem('adminInfo');
        
        if (adminInfo) {
            try {
                const userData = JSON.parse(adminInfo);
                setDesignation(userData.designation);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
        setIsLoading(false);
    }, []);

    return { designation, isLoading };
};

export default useAuthCheck;