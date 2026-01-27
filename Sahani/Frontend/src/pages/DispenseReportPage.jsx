// src/pages/DispenseReportPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

const DispenseReportPage = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [monthYear, setMonthYear] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });

    const handleGenerateReport = async () => {
        setLoading(true);
        setReportData(null);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`/api/dispense/report/monthly?year=${monthYear.year}&month=${monthYear.month}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setReportData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error generating report. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h1>📊 Monthly Drug Usage Report</h1>

            <div className="card p-4 mb-4">
                <h5>Select Month for Report</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Year (e.g., 2024)"
                            value={monthYear.year}
                            onChange={(e) => setMonthYear({ ...monthYear, year: e.target.value })}
                            min="2020"
                            max={new Date().getFullYear()}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={monthYear.month}
                            onChange={(e) => setMonthYear({ ...monthYear, month: e.target.value })}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>
                                    {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-info w-100" onClick={handleGenerateReport} disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">Report Error: {error}</div>}

            {reportData && (
                <div className="mt-5">
                    <h3>Usage Summary for {reportData.month}</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Total Issued Quantity</th>
                                <th>Current Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.report.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.item}</td>
                                    <td>{item.category}</td>
                                    <td>{item.totalQuantityIssued}</td>
                                    <td>{item.currentStock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reportData.report.length === 0 && <p className="text-center">No dispensing logs found for this period.</p>}
                </div>
            )}
        </div>
    );
};

export default DispenseReportPage;