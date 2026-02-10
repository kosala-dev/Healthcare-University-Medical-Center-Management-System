import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MedicalHistoryForm() {
  const [formData, setFormData] = useState({
    regNo: "",
    bloodPressure: "",
    weight: "",
    temperature: "",
    symptoms: "",
    diagnosis: "",
    visitDate: "",
  });

  const [drugsList, setDrugsList] = useState([]); 
  const [selectedDrugs, setSelectedDrugs] = useState([]); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // get all drugs 
  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/drugs"); 
        setDrugsList(res.data);
      } catch (err) {
        console.error("Error fetching drugs:", err);
      }
    };
    fetchDrugs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrugSelect = (index, field, value) => {
    setSelectedDrugs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: field === "quantity" ? parseInt(value) : value };
      return updated;
    });
  };

  const addDrugRow = () => {
    setSelectedDrugs((prev) => [...prev, { drugId: "", quantity: 0 }]);
  };

  const removeDrugRow = (index) => {
    setSelectedDrugs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validDrugs = selectedDrugs.filter((d) => d.drugId && d.quantity > 0);
    if (validDrugs.length === 0) {
      setErrorMessage("Please select at least one drug with quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/medicalhis/medical-history",
        { ...formData, drugs: validDrugs },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setSuccessMessage("Medical history added successfully!");
        setErrorMessage("");
        setFormData({
          regNo: "",
          bloodPressure: "",
          weight: "",
          temperature: "",
          symptoms: "",
          diagnosis: "",
          visitDate: "",
        });
        setSelectedDrugs([]);
        setTimeout(() => navigate("/medicalhistoryform"), 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to add medical history.");
      setSuccessMessage("");
      console.error(error);
    }
  };

  // Role-based Go Back button
  const handleGoBack = () => {
    const role = sessionStorage.getItem("role");
    if (role === "admin") navigate("/admindashboard");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Medical Center University of Vavuniya</h1>
          <p className="text-sm text-white mt-2">Secure and Reliable Healthcare Services</p>
        </div>
        <div>
          <button
            onClick={handleGoBack}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="w-3/4 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Prescription/Diagnosis</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {successMessage && <div className="mb-6 text-green-600 text-center text-lg">{successMessage}</div>}
          {errorMessage && <div className="mb-6 text-red-500 text-center text-lg">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {["regNo", "bloodPressure", "bloodSugar", "weight", "temperature", "diagnosis", "prescription"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-gray-700 mb-2">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )
            )}

            <div>
              <label className="block text-gray-700 mb-2">Visit Date</label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Select Drugs</label>
              {selectedDrugs.map((drugRow, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <select
                    className="w-2/3 p-2 border border-gray-300 rounded-lg"
                    value={drugRow.drugId}
                    onChange={(e) => handleDrugSelect(index, "drugId", e.target.value)}
                    required
                  >
                    <option value="">-- Select Drug --</option>
                    {drugsList.map((drug) => (
                      <option key={drug._id} value={drug._id}>
                        {drug.name} (Available: {drug.quantity})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={drugRow.quantity || ""}
                    onChange={(e) => handleDrugSelect(index, "quantity", e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeDrugRow(index)}
                    className="bg-red-500 text-white px-2 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addDrugRow}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Add Drug
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}