// src/pages/UnauthorizedPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="text-center p-5 border rounded shadow-lg bg-light">
                <h1 className="display-1 text-danger">403</h1>
                <h2 className="mb-4">Access Denied: Unauthorized Role</h2>
                <p className="lead mb-4">
                    You do not have the required permissions (designation) to view this page.
                    If you believe this is an error, please contact your Super Administrator.
                </p>
                <Link to="/" className="btn btn-primary btn-lg">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;