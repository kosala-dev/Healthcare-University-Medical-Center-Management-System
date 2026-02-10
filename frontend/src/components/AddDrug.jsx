import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddDrug() {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleGoBack = () => navigate("/drugs");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/drugs", {
        name,
        dosage,
        quantity: Number(quantity),
      });

      setSuccess("Drug added successfully!");
      setName("");
      setDosage("");
      setQuantity("");
    } catch (err) {
      setError(err.response?.data?.error || "Error adding drug");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Add New Drug</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleGoBack}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 flex justify-center items-start">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 bg-white p-6 md:p-8 rounded-lg shadow-lg">
          {error && <p className="text-red-600 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}

          <div>
            <label className="block font-medium mb-1">Drug Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Dosage</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Drug
          </button>
        </form>
      </div>
    </div>
  );
}
