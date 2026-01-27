// src/pages/DoctorInventoryPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorInventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInventory = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token'); 
        
        try {
            const response = await axios.get('/api/drugs/doctor-view', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setInventory(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching inventory.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <div className="container mt-4">
            <h1>🏥 Doctor's Inventory View</h1>
            <p className="text-muted">This list provides essential drug and equipment stock levels for consultation reference.</p>
            
            {loading && <div className="alert alert-info">Loading inventory...</div>}
            {error && <div className="alert alert-danger">Error: {error}</div>}

            <table className="table table-striped table-hover mt-3">
                <thead>
                    <tr>
                        <th>Drug Name</th>
                        <th>Category</th>
                        <th>Stock Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.stockQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorInventoryPage;