import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterAdmin() {
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [admintype, setAdminType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/registerAdmin",
        { username, gender, admintype, password }
      );
      if (response.status === 201) {
        setSuccessMessage("Admin registered successfully!");
        setErrorMessage("");
        setUsername("");
        setGender("");
        setAdminType("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/admindetails"), 2000);
      }
    } catch (error) {
      setErrorMessage("Error registering admin. Please try again.");
      setSuccessMessage("");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate("/superadmindashboard")}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Register Doctor/Admin
          </h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {successMessage && (
            <div className="mb-4 text-green-600 text-center text-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-red-600 text-center text-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Admin Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Admin Type
              </label>
              <select
                value={admintype}
                onChange={(e) => setAdminType(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Admin Type</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                Register Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
