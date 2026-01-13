import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function RegisterAdmin() {
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [admintype, setAdminType] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
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

  //  CLEAN PAYLOAD
  const payload = {
    username,
    gender,
    admintype,
    password,
  };

  if (admintype !== "admin") {
    payload.faculty = faculty;
  }

  if (admintype === "advisor" || admintype === "hod") {
    payload.department = department;
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/auth/registerAdmin",
      payload
    );

    if (response.status === 201) {
      setSuccessMessage("Admin registered successfully!");
      setErrorMessage("");

      setUsername("");
      setGender("");
      setAdminType("");
      setFaculty("");
      setDepartment("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/admindetails"), 2000);
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error.response?.data || error.message);
    setErrorMessage(error.response?.data?.error || "Registration failed");
    setSuccessMessage("");
  }
};


  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
        {/* Sidebar */}
        <div className="w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Medical Center University of Vavuniya
            </h1>
            <p className="text-sm text-white mt-2">
              Secure and Reliable Healthcare Services
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate("/superadmindashboard")}
              className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-8">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Register Doctor/Admin
            </h1>
            <hr className="mt-2 border-t-2 border-gray-200" />
          </div>

          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {successMessage && (
              <div className="mb-6 text-green-600 text-center text-lg">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 text-red-500 text-center text-lg">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Gender
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Admin Type */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Admin Type
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={admintype}
                  onChange={(e) => setAdminType(e.target.value)}
                  required
                >
                  <option value="">Select Admin Type</option>
                  <option value="admin">Admin</option>
                  <option value="advisor">Advisor</option>
                  <option value="hod">HOD</option>
                  <option value="dean">Dean</option>
                </select>
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Faculty
                </label>
                {admintype !== "admin" && (
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  required
                >
                  <option value="">Select a Faculty</option>
                  <option value="Faculty of Applied Science">
                    Faculty of Applied Science
                  </option>
                  <option value="Faculty of Business Studies">
                    Faculty of Business Studies
                  </option>
                  <option value="Faculty of Technological Studies">
                    Faculty of Technological Studies
                  </option>
                </select>
                )}
              </div>


              {/* Department */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Department
                </label>
                {(admintype === "advisor" || admintype === "hod") && (
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select a Department</option>
                  <option value="Department of Physical Science">
                    Department of Physical Science
                  </option>
                  <option value="Department of Bio Science">
                    Department of Bio Science
                  </option>
                  <option value="Business Economics">Business Economics</option>
                  <option value="English Language Teaching">
                    English Language Teaching
                  </option>
                  <option value="Finance and Accountancy">
                    Finance and Accountancy
                  </option>
                  <option value="Human Resource Management">
                    Human Resource Management
                  </option>
                  <option value="Management and Entrepreneurship">
                    Management and Entrepreneurship
                  </option>
                  <option value="Marketing Management">
                    Marketing Management
                  </option>
                  <option value="Project Management">Project Management</option>
                  <option value="Department of ICT">Department of ICT</option>
                </select>
                )}
              </div>

              
              {/* Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Register Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
