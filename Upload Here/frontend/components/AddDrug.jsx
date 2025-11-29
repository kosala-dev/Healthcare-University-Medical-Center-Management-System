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

  const handleClick = () => {
    navigate("/drugs"); // go back to drug list
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8080/drugs", {
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
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-gradient-to-b from-blue-600 to-purple-600 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Drug</h1>
        </div>
        <div>
          <button
            onClick={handleClick}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-10">
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <label className="block font-medium">Drug Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Dosage</label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Drug
          </button>
        </form>
      </div>
    </div>
  );
}
