import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MedicalHistoryForm() {
  const [formData, setFormData] = useState({
    regNo: "",
    bloodPressure: "",
    bloodSugar: "",
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
      updated[index] = {
        ...updated[index],
        [field]: field === "quantity" ? parseInt(value) : value,
      };
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
          bloodSugar: "",
          weight: "",
          temperature: "",
          diagnosis: "",
          prescription: "",
          visitDate: "",
        });
        setSelectedDrugs([]);
        setTimeout(() => navigate("/medicalhistoryform"), 2000);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add medical history."
      );
      setSuccessMessage("");
      console.error(error);
    }
  };

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
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100"
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
            <div className="mb-4 text-green-600 text-center text-base md:text-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-red-500 text-center text-base md:text-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Patient Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "regNo",
                "bloodPressure",
                "bloodSugar",
                "weight",
                "temperature",
                "diagnosis",
                "prescription",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 mb-1 md:mb-2">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              ))}

              {/* Visit Date */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 md:mb-2">Visit Date</label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Drug Selection */}
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Select Drugs
              </label>
              <div className="flex flex-col space-y-2">
                {selectedDrugs.map((drugRow, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0"
                  >
                    <select
                      className="flex-1 p-2 border border-gray-300 rounded-lg"
                      value={drugRow.drugId}
                      onChange={(e) =>
                        handleDrugSelect(index, "drugId", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleDrugSelect(index, "quantity", e.target.value)
                      }
                      className="w-full sm:w-32 p-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeDrugRow(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg w-full sm:w-auto"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

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
              className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
