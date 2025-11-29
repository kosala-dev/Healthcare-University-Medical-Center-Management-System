import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Medicalhistory() {
  const [medicalHistories, setMedicalHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRegNo, setFilterRegNo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/medicalhis/medical-history-get")
      .then((res) => {
        const sorted = res.data.sort((a, b) => a.regNo.localeCompare(b.regNo));
        setMedicalHistories(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medical histories:", err);
        setLoading(false);
      });
  }, []);

  const filteredHistories = medicalHistories.filter((h) =>
    h.regNo.toLowerCase().includes(filterRegNo.toLowerCase())
  );

  if (loading) return <p>Loading medical histories...</p>;
  if (!medicalHistories.length) return <p>No medical histories found.</p>;

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/admindashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
        >
          Back to Admin Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Patient Medical Histories</h2>

      {/* Filter input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Registration Number"
          value={filterRegNo}
          onChange={(e) => setFilterRegNo(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />
      </div>

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-teal-500 text-white">
            <th className="px-4 py-2">Reg No</th>
            <th className="px-4 py-2">BP</th>
            <th className="px-4 py-2">BS</th>
            <th className="px-4 py-2">Weight</th>
            <th className="px-4 py-2">Temp</th>
            <th className="px-4 py-2">Symptoms</th>
            <th className="px-4 py-2">Diagnosis</th>
            <th className="px-4 py-2">Drugs</th>
            <th className="px-4 py-2">Visit Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistories.map((h, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-4 py-2">{h.regNo}</td>
              <td className="px-4 py-2">{h.bloodPressure}</td>
              <td className="px-4 py-2">{h.bloodSugar}</td>
              <td className="px-4 py-2">{h.weight}</td>
              <td className="px-4 py-2">{h.temperature}</td>
              <td className="px-4 py-2">{h.symptoms}</td>
              <td className="px-4 py-2">{h.diagnosis}</td>
              <td className="px-4 py-2">
                {h.drugs?.map((d) => `${d.drugId?.name} (Qty: ${d.quantity})`).join(", ")}
              </td>
              <td className="px-4 py-2">{new Date(h.visitDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
