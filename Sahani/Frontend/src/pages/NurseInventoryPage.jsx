// src/pages/NurseInventoryPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LowStockAlerts from '../components/LowStockAlerts'; 

const NurseInventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Placeholder for CRUD state:
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Medicine', stockQuantity: 0, isQuickMedicine: false });

    // 1. Fetch all Inventory (for CRUD table)
    const fetchInventory = async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); 
        try {
            // Using the general route /api/drugs (assuming this provides full detail for Nurse)
            const response = await axios.get('/api/drugs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setInventory(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // 2. Handle Create Operation (Example for adding a new item)
    const handleCreateItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); 
        try {
            await axios.post('/api/drugs', newItem, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Item created successfully!');
            setNewItem({ name: '', category: 'Medicine', stockQuantity: 0, isQuickMedicine: false });
            setIsAdding(false);
            fetchInventory(); // Refresh the list
        } catch (err) {
            alert('Error creating item: ' + (err.response?.data?.message || 'Check console'));
        }
    };
    
    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <div className="container mt-4">
            <h1>📦 Nurse Inventory Management</h1>

            <LowStockAlerts />

            <div className="mb-4">
                <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel Add' : '➕ Add New Item'}
                </button>
            </div>

            {/* --- ADD NEW ITEM FORM (CRUD) --- */}
            {isAdding && (
                <div className="card p-3 mb-4">
                    <h5>Add New Inventory Item</h5>
                    <form onSubmit={handleCreateItem}>
                        {/* ... Input fields for name, category, stockQuantity, isQuickMedicine ... */}
                        <div className="row g-3">
                             <div className="col-md-4">
                                <input type="text" className="form-control" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
                            </div>
                            <div className="col-md-3">
                                <select className="form-select" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>
                                    <option value="Medicine">Medicine</option>
                                    <option value="Equipment">Equipment</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <input type="number" className="form-control" placeholder="Stock Quantity" min="0" value={newItem.stockQuantity} onChange={(e) => setNewItem({...newItem, stockQuantity: parseInt(e.target.value)})} required />
                            </div>
                             <div className="col-md-2 d-flex align-items-center">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" checked={newItem.isQuickMedicine} onChange={(e) => setNewItem({...newItem, isQuickMedicine: e.target.checked})} id="quickCheck" disabled={newItem.category === 'Equipment'}/>
                                    <label className="form-check-label" htmlFor="quickCheck">Quick Issue</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-success">Save Item</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            
            {/* --- INVENTORY LIST TABLE (RUD) --- */}
            <h3 className="mt-5">Full Inventory List</h3>
            {loading && <div className="alert alert-info">Loading full inventory...</div>}
            {error && <div className="alert alert-danger">CRUD Error: {error}</div>}

            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Quick Issue?</th>
                        <th>Actions (CRUD)</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through inventory state here for Read/Update/Delete rows */}
                    {inventory.map((item) => (
                        <tr key={item._id}>
                            <td>{item._id.slice(-6)}</td>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.stockQuantity}</td>
                            <td>{item.isQuickMedicine ? 'Yes' : 'No'}</td>
                            <td>
                                {/* Placeholder: You would add Update and Delete buttons here */}
                                <button className="btn btn-sm btn-warning me-2">Edit</button>
                                <button className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NurseInventoryPage;