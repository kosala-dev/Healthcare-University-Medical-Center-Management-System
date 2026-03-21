import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateDrug() {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const drug = location.state?.drug; // Get drug from navigation state

  useEffect(() => {
    if (!drug) {
      navigate("/drugs");
      return;
    }
    setName(drug.name);
    setDosage(drug.dosage);
    setQuantity(drug.quantity);
  }, [drug, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !dosage || quantity <= 0) {
      setErrorMessage("All fields are required and quantity must be greater than 0.");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:8080/drugs/${drug._id}`, {
        name,
        dosage,
        quantity,
      });

      if (res.data.success) {
        setSuccessMessage("Drug updated successfully.");
        setErrorMessage("");
        navigate("/drugs");
      } else {
        setErrorMessage(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleGoBack = () => navigate("/drugs");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Update Drug</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleGoBack}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-full md:max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Update Drug Details</h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {successMessage && <div className="mb-4 text-green-600 text-center">{successMessage}</div>}
          {errorMessage && <div className="mb-4 text-red-600 text-center">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium">Drug Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Dosage</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                Update Drug
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
