import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DrugInventory() {
  const [drugs, setDrugs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDrug, setSelectedDrug] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/drugs")
      .then((res) => setDrugs(res.data))
      .catch((err) => console.error("Error fetching drugs:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  const filteredDrugs = drugs.filter((drug) =>
    drug.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDrugs = [...filteredDrugs].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    
    if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
    if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();
    
    return sortOrder === "asc" 
      ? (fieldA > fieldB ? 1 : -1) 
      : (fieldA < fieldB ? 1 : -1);
  });

  const getQuantityColor = (quantity) => {
    if (quantity < 50) return "bg-red-100 text-red-800 border-red-200";
    if (quantity < 100) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const handleAddDrug = () => navigate("/addDrugs");
  const handleUpdate = (drug) => navigate("/updateDrugs", { state: { drug } });
  const handleGoBack = () => navigate("/admindashboard");

  const handleDelete = async (drugId) => {
    if (window.confirm("Are you sure you want to delete this drug?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/drugs/${drugId}`);
        if (response.status === 200) {
          setDrugs(drugs.filter((drug) => drug._id !== drugId));
        }
      } catch (error) {
        console.error("Error deleting drug:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col h-screen sticky top-0">
        
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">Drug Inventory</h1>
          <p className="text-white/70 text-sm mt-1">Manage stock & alerts</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 mb-6 custom-scrollbar">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            🔔 Recent Alerts
          </h3>
          
          {notifications.length === 0 ? (
            <div className="text-white/50 text-sm italic">No new notifications</div>
          ) : (
            <div className="space-y-3">
              {notifications.map((note) => (
                <div 
                  key={note._id} 
                  className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 shadow-sm"
                >
                  <p className="text-white text-sm font-medium leading-snug">
                    {note.message}
                  </p>
                  <p className="text-[10px] text-white/60 mt-1 text-right">
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-white/20">
          <button
            onClick={handleGoBack}
            className="w-full bg-white text-[#670047] py-2 px-4 rounded-lg hover:bg-gray-100 font-bold shadow-md transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Inventory List
              </h1>
              <div className="h-1 w-20 bg-[#670047] mt-2 rounded-full"></div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAddDrug}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                + Add Drug
              </button>
              <button
                onClick={() => navigate("/monthly-drug-report")}
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium flex items-center gap-2"
              >
                📄 Generate Report
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search drugs by name..."
                className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#670047] focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-600 text-sm font-medium">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#670047]"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="dosage">Dosage</option>
                <option value="quantity">Quantity</option>
              </select>
              <button
                className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "⬆ Asc" : "⬇ Desc"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#670047] text-white">
                <tr>
                  {["name", "dosage", "quantity"].map((field) => (
                    <th
                      key={field}
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#500036] transition-colors"
                      onClick={() => {
                        setSortOrder(sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                        setSortField(field);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {sortField === field && (
                          <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDrugs.map((drug, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-purple-50 transition-colors duration-150 ${selectedDrug === index ? "bg-purple-100" : ""}`}
                    onClick={() => setSelectedDrug(selectedDrug === index ? null : index)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{drug.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{drug.dosage}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getQuantityColor(drug.quantity)}`}>
                        {drug.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                          onClick={(e) => { e.stopPropagation(); handleUpdate(drug); }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                          onClick={(e) => { e.stopPropagation(); handleDelete(drug._id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {sortedDrugs.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No drugs found matching your search.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}