import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DrugInventory() {
  const [drugs, setDrugs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDrug, setSelectedDrug] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/drugs")
      .then((response) => response.json())
      .then((data) => setDrugs(data))
      .catch((error) => console.error("Error fetching drugs:", error));
  }, []);

  const filteredDrugs = drugs.filter((drug) =>
    drug.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDrugs = [...filteredDrugs].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];
    if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
    if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();
    return sortOrder === "asc" ? (fieldA > fieldB ? 1 : -1) : fieldA < fieldB ? 1 : -1;
  });

  const getQuantityColor = (quantity) => {
    if (quantity < 50) return "bg-red-100 text-red-800";
    if (quantity < 100) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const handleAddDrug = () => {
    navigate("/addDrugs");
  };

  const handleUpdate = (drug) => {
    navigate("/updateDrugs", { state: { drug } });
  };

  const handleDelete = async (drugId) => {
    if (window.confirm("Are you sure you want to delete this drug?")) {
      try {
        const response = await fetch(`http://localhost:8080/drugs/${drugId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setDrugs(drugs.filter((drug) => drug._id !== drugId));
        } else {
          console.error("Failed to delete drug");
        }
      } catch (error) {
        console.error("Error deleting drug:", error);
      }
    }
  };

  const handleGoBack = () => {
    navigate("/admindashboard"); // Go back to Admin Dashboard
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Drug Inventory</h1>
        </div>
        <div>
          <button
            onClick={handleGoBack}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header and Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Drug Inventory Management</h1>
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleAddDrug}
            >
              Add Drug
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => navigate("/monthly-drug-report")}
            >
              Drug Report
            </button>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search drugs by name..."
              className="border border-gray-300 rounded-lg pl-4 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="dosage">Dosage</option>
              <option value="quantity">Quantity</option>
            </select>
            <button
              className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>

        {/* Drug Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["name", "dosage", "quantity"].map((field) => (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setSortOrder(sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                      setSortField(field);
                    }}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDrugs.map((drug, index) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedDrug === index ? "bg-blue-100" : ""}`}
                  onClick={() => setSelectedDrug(selectedDrug === index ? null : index)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{drug.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{drug.dosage}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getQuantityColor(drug.quantity)}`}>
                      {drug.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors mr-2"
                      onClick={() => handleUpdate(drug)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => handleDelete(drug._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
