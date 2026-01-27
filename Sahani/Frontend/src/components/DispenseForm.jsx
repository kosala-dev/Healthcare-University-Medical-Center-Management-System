// src/components/DispenseForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const DispenseForm = () => {
    const [form, setForm] = useState({
        patientId: '',
        prescriptionRef: '',
        itemId: '',
        quantity: 1,
        dispenseType: 'prescription' 
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const token = localStorage.getItem('token');
        
        const isQuick = form.dispenseType === 'quick';
        const url = isQuick ? '/api/dispense/quick-issue' : '/api/dispense/prescription';
        
        let body;
        if (isQuick) {
            body = {
                itemId: form.itemId,
                quantity: parseInt(form.quantity),
                patientId: form.patientId,
            };
        } else {
            // Backend expects an array for 'items' for prescription dispensing
            body = {
                items: [{ itemId: form.itemId, quantity: parseInt(form.quantity) }],
                patientId: form.patientId,
                prescriptionRef: form.prescriptionRef
            };
        }

        try {
            const response = await axios.post(url, body, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setMessage({ type: 'success', text: response.data.message });
            // Reset fields but keep dispense type
            setForm({ patientId: '', prescriptionRef: '', itemId: '', quantity: 1, dispenseType: form.dispenseType });

        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'An unknown error occurred during dispensing.' });
        } finally {
            setLoading(false);
        }
    };

    const isPrescription = form.dispenseType === 'prescription';

    return (
        <div className="container mt-4">
            <h2>💊 Drug Dispensing</h2>
            <div className="btn-group mb-3">
                <button 
                    className={`btn ${isPrescription ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ ...form, dispenseType: 'prescription' })}
                >
                    Dispense by Prescription
                </button>
                <button 
                    className={`btn ${!isPrescription ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setForm({ ...form, dispenseType: 'quick' })}
                >
                    Quick Issue (Medicine)
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {message && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                        {message.text}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Patient ID</label>
                    <input type="text" className="form-control" name="patientId" value={form.patientId} onChange={handleChange} required />
                </div>
                
                {isPrescription && (
                    <div className="mb-3">
                        <label className="form-label">Prescription Reference ID</label>
                        <input type="text" className="form-control" name="prescriptionRef" value={form.prescriptionRef} onChange={handleChange} required />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Drug/Item ID (from Inventory)</label>
                    <input type="text" className="form-control" name="itemId" value={form.itemId} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" name="quantity" value={form.quantity} onChange={handleChange} min="1" required />
                </div>

                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Processing...' : `Dispense ${isPrescription ? 'Prescription' : 'Quick'} Item`}
                </button>
            </form>
        </div>
    );
};

export default DispenseForm;