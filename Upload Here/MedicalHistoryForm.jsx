import React, { useState } from "react";
import axios from "axios";

export default function Form() {
  const [formData, setFormData] = useState({
    regNo: "",
    bloodPressure: "",
    height: "",
    weight: "",
    bmi: "",
    bmiCategory: "",   // calculated but not input
    temperature: "",
    diagnosis: "",
    prescription: "",
    visitDate: "",
    
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    let updatedData = {
      ...formData,
      [name]: files ? files[0] : value,
    };

    // 🔹 Auto BMI + Category calculation
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      const res = await axios.post(
        "http://localhost:8080/api/medicalForm/submit",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Medical form submitted successfully!");
      console.log(res.data);

      // clear form
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

    } catch (err) {
      console.error(err);
      alert("Error submitting medical form");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Medical Examination Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Registration Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="text"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Blood Pressure
          </label>
          <input
            type="text"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>


        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* BMI with Category text under it */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            BMI
          </label>
          <input
            type="text"
            name="bmi"
            value={formData.bmi}
            readOnly
            className="mt-1 block w-full px-4 py-2 border bg-gray-100 rounded-md"
          />

          {/* Category as simple text, no box */}
          {formData.bmiCategory && (
            <p className="mt-2 text-sm text-gray-600">
              Category:{" "}
              <span className="font-semibold text-teal-700">
                {formData.bmiCategory}
              </span>
            </p>
          )}
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Temperature
          </label>
          <input
            type="text"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Diagnosis
          </label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Prescription */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prescription
          </label>
          <textarea
            name="prescription"
            value={formData.prescription}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Visit Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Visit Date
          </label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>


        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
