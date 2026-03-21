import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function MedicalHistoryForm() {
  const [formData, setFormData] = useState({
    regNo: "",
    bloodPressure: "",
    height: "",
    weight: "",
    bmi: "",
    bmiCategory: "",
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

  // fetch Drugs
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

  // fill reg no
  useEffect(() => {
    if (location.state?.preFilledRegNo) {
      setFormData((prev) => ({
        ...prev,
        regNo: location.state.preFilledRegNo,
      }));
    }
  }, [location.state]);

  const uniqueDrugNames = [...new Set(drugsList.map((d) => d.name))];

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "height" || name === "weight") {
      const height = name === "height" ? value : formData.height;
      const weight = name === "weight" ? value : formData.weight;

      if (height && weight) {
        const h = height / 100;
        const bmi = (weight / (h * h)).toFixed(2);

        let category = "";
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";

        updatedData.bmi = bmi;
        updatedData.bmiCategory = category;
      } else {
        updatedData.bmi = "";
        updatedData.bmiCategory = "";
      }
    }

    setFormData(updatedData);
  };

  const handleNameSelect = (index, value) => {
    setSelectedDrugs((prev) => {
      const updated = [...prev];
      updated[index] = { tempName: value, drugId: "", quantity: 0 };
      return updated;
    });
  };

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

    const validDrugs = selectedDrugs.filter(
      (d) => d.drugId && d.quantity > 0
    );

    if (validDrugs.length === 0) {
      setErrorMessage("Please select at least one drug with quantity.");
      return;
    }

    const generatedPrescription = validDrugs
      .map((d) => {
        const drug = drugsList.find((item) => item._id === d.drugId);
        return drug
          ? `${drug.name} ${drug.dosage} (Qty: ${d.quantity})`
          : "";
      })
      .filter(Boolean)
      .join(", ");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/medicalhis/medical-history",
        {
          ...formData,
          prescription: generatedPrescription,
          drugs: validDrugs,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        setSuccessMessage("Medical history added successfully!");
        setErrorMessage("");
        setFormData({
          regNo: "",
          bloodPressure: "",
          height: "",
          weight: "",
          bmi: "",
          bmiCategory: "",
          temperature: "",
          diagnosis: "",
          prescription: "",
          visitDate: "",
        });
        setSelectedDrugs([]);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to add medical history."
      );
      setSuccessMessage("");
    }
  };

return (
  <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
    <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Medical Center University of Vavuniya
        </h1>
        <p className="text-white mt-2 text-sm opacity-90">
          Secure Healthcare Services
        </p>
      </div>

      <button
        onClick={() => navigate("/admindashboard")}
        className="bg-white text-[#670047] py-2 rounded-lg font-semibold"
      >
        Back to Dashboard
      </button>
    </div>

    <div className="w-full md:w-3/4 p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Add Prescription / Diagnosis
      </h2>

      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 mb-4">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Registration No</label>
          <input
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Blood Pressure</label>
          <input
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">BMI</label>
          <input
            value={formData.bmi}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
          {formData.bmiCategory && (
            <p className="text-sm mt-1 text-gray-600">
              Category: <span className="font-semibold">{formData.bmiCategory}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Visit Date</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prescribed Drugs</label>

          <button
            type="button"
            onClick={addDrugRow}
            className="mb-3 px-4 py-2 border rounded hover:bg-gray-100"
          >
            + Add Drug
          </button>

          {selectedDrugs.map((row, index) => {
            const available = drugsList.filter(
              (d) => d.name === row.tempName
            );

            return (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  className="p-2 border rounded w-1/3"
                  onChange={(e) =>
                    handleNameSelect(index, e.target.value)
                  }
                >
                  <option value="">Drug</option>
                  {uniqueDrugNames.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>

                <select
                  className="p-2 border rounded w-1/3"
                  onChange={(e) =>
                    handleDrugDetailSelect(index, "drugId", e.target.value)
                  }
                >
                  <option value="">Dosage</option>
                  {available.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.dosage}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  className="p-2 border rounded w-1/6"
                  placeholder="Qty"
                  onChange={(e) =>
                    handleDrugDetailSelect(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() => removeDrugRow(index)}
                  className="text-red-500 font-semibold"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="bg-[#670047] text-white px-6 py-3 rounded font-semibold hover:opacity-90"
        >
          Save Medical History
        </button>
      </form>
    </div>
  </div>
);
}