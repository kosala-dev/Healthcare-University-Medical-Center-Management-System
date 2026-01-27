// src/components/LowStockAlerts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LowStockAlerts = () => {
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Low stock threshold is defined in the backend (100 in your controller)
    const LOW_STOCK_THRESHOLD = 100; 

    const fetchLowStock = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token'); 
        
        try {
            const response = await axios.get('/api/drugs/low-stock', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setLowStock(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching low stock alerts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLowStock();
    }, []);

    return (
        <div className="card border-danger mb-4">
            <div className="card-header bg-danger text-white">
                <h4 className="mb-0">⚠️ Low Stock Alerts ({lowStock.length})</h4>
            </div>
            <div className="card-body">
                {loading && <p>Checking stock levels...</p>}
                {error && <p className="text-danger">Alert Error: {error}</p>}
                
                {lowStock.length === 0 && !loading && !error && <p>All stock levels are currently adequate (above {LOW_STOCK_THRESHOLD}).</p>}
                
                <ul className="list-group">
                    {lowStock.map((item) => (
                        <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                            **{item.name}** ({item.category})
                            <span className="badge bg-warning text-dark">
                                Only {item.stockQuantity} left
                            </span>
                        </li>
                    ))}
                </ul>
                <button onClick={fetchLowStock} className="btn btn-sm btn-outline-secondary mt-3">Refresh Alerts</button>
            </div>
        </div>
    );
};

export default LowStockAlerts;