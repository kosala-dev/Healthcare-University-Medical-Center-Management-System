import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; 

export default function MedicalHistoryForm() {
  const [formData, setFormData] = useState({
    regNo: "",
    bloodPressure: "",
    weight: "",
    temperature: "",
    diagnosis: "",
    prescription: "",
    visitDate: "",
  });

  const [drugsList, setDrugsList] = useState([]);
  
  const [selectedDrugs, setSelectedDrugs] = useState([]); 
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); 

  // Fetch Drugs on Load
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

  // Pre-fill Registration Number (from Appointments)
  useEffect(() => {
    if (location.state && location.state.preFilledRegNo) {
      setFormData((prev) => ({
        ...prev,
        regNo: location.state.preFilledRegNo, // Pre-fill the field
      }));
    }
  }, [location.state]);

  const uniqueDrugNames = [...new Set(drugsList.map((d) => d.name))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Drug Name Selection (Dropdown 1)
  const handleNameSelect = (index, nameValue) => {
    setSelectedDrugs((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        tempName: nameValue, 
        drugId: "",          
        quantity: 0          
      };
      return updated;
    });
  };

  // Handle Dosage/Specific Drug Selection (Dropdown 2) & Quantity
  const handleDrugDetailSelect = (index, field, value) => {
    setSelectedDrugs((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "quantity" ? parseInt(value) : value,
      };
      return updated;
    });
  };

  const addDrugRow = () => {
    setSelectedDrugs((prev) => [...prev, { tempName: "", drugId: "", quantity: 0 }]);
  };

  const removeDrugRow = (index) => {
    setSelectedDrugs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate rows
    const validDrugs = selectedDrugs.filter((d) => d.drugId && d.quantity > 0);
    
    if (validDrugs.length === 0) {
      setErrorMessage("Please select at least one drug with dosage and quantity.");
      return;
    }


    const generatedPrescription = validDrugs.map(d => {
        const drugInfo = drugsList.find(item => item._id === d.drugId);
        return drugInfo 
          ? `${drugInfo.name} ${drugInfo.dosage} (Qty: ${d.quantity})` 
          : "";
    }).filter(Boolean).join(", ");

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:8080/medicalhis/medical-history",
        { 
            ...formData, 
            prescription: generatedPrescription, 
            drugs: validDrugs 
        },
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
          diagnosis: "",
          prescription: "",
          visitDate: "",
        });
        setSelectedDrugs([]);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add medical history."
      );
      setSuccessMessage("");
      console.error(error);
    }
  };

  const inputFields = [
    { key: "regNo", label: "Registration Number" },
    { key: "bloodPressure", label: "Blood Pressure" },
    { key: "weight", label: "Weight (kg)" },
    { key: "temperature", label: "Temperature (ºC)" },
    { key: "diagnosis", label: "Diagnosis" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm md:text-base text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate("/admindashboard")}
            className="w-full bg-white text-[#670047] py-2 px-4 rounded-lg hover:bg-gray-100 font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="w-full md:w-3/4 p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Add Prescription/Diagnosis
        </h1>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          {successMessage && (
            <div className="mb-4 text-green-600 text-center text-base md:text-lg bg-green-50 p-2 rounded border border-green-200">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-red-500 text-center text-base md:text-lg bg-red-50 p-2 rounded border border-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.key} className="flex flex-col">
                  <label className="text-gray-700 mb-1 md:mb-2 font-medium">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.key}
                    value={formData[field.key]}
                    onChange={handleChange}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#670047]"
                    required
                  />
                </div>
              ))}

              {/* Visit Date */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 md:mb-2 font-medium">Visit Date</label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#670047]"
                  required
                />
              </div>
            </div>

            {/* Drug Selection Area */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-gray-800 mb-3 font-bold text-lg">
                Prescribe Medicine
              </label>
              
              <div className="flex flex-col space-y-3">
                {selectedDrugs.map((row, index) => {
                   // Filter dosages based on the selected Name
                   const availableDosages = drugsList.filter(d => d.name === row.tempName);

                   return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-white rounded shadow-sm"
                    >
                      {/* 1. Select Drug Name */}
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Drug Name</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-[#670047] focus:border-[#670047]"
                          value={row.tempName || ""}
                          onChange={(e) => handleNameSelect(index, e.target.value)}
                          required
                        >
                          <option value="">-- Select Name --</option>
                          {uniqueDrugNames.map((name) => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>

                      {/* 2. Select Dosage (Visible only after Name selected) */}
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Dosage</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded focus:ring-[#670047] focus:border-[#670047]"
                          value={row.drugId || ""}
                          onChange={(e) => handleDrugDetailSelect(index, "drugId", e.target.value)}
                          disabled={!row.tempName}
                          required
                        >
                          <option value="">-- Select Dosage --</option>
                          {availableDosages.map((drug) => (
                            <option key={drug._id} value={drug._id}>
                              {drug.dosage} (Stock: {drug.quantity})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 3. Enter Quantity */}
                      <div className="w-full md:w-24">
                        <label className="block text-xs text-gray-500 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="0"
                          value={row.quantity || ""}
                          onChange={(e) => handleDrugDetailSelect(index, "quantity", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-[#670047] focus:border-[#670047]"
                          required
                        />
                      </div>

                      {/* Remove Button */}
                      <div className="flex items-end pb-1">
                         <button
                          type="button"
                          onClick={() => removeDrugRow(index)}
                          className="text-red-500 hover:text-red-700 font-semibold text-sm px-2"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                   );
                })}
              </div>

              <button
                type="button"
                onClick={addDrugRow}
                className="mt-4 text-[#670047] border border-[#670047] px-4 py-2 rounded hover:bg-[#670047] hover:text-white transition text-sm font-semibold"
              >
                + Add Another Drug
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-[#670047] text-white p-3.5 rounded-lg hover:bg-[#500036] font-bold text-lg shadow-lg transition transform hover:scale-[1.01]"
            >
              Save Medical History
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}