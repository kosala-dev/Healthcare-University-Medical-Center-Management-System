import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

    if (admintype !== "admin" && !faculty) {
      setErrorMessage("Please select a Faculty.");
      return;
    }

    if ((admintype === "advisor" || admintype === "hod") && !department) {
      setErrorMessage("Please select a Department.");
      return;
    }


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

        // Reset form
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Navbar Section */}
      <div>
        <Navbar/>
      </div>

        {/* Main Content - Centered with flex-grow to push footer down */}
        <div className="flex-grow flex items-center justify-center p-4 md:p-8">
          <div className="w-full md:w-3/4 lg:w-2/3 max-w-4xl">
            
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
                Register Admin
              </h1>
              <hr className="mt-3 border-t-2 border-gray-200" />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              {successMessage && (
                <div className="mb-6 text-green-700 text-center text-sm font-semibold bg-green-50 p-4 rounded-lg border border-green-200">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-6 text-red-600 text-center text-sm font-semibold bg-red-50 p-4 rounded-lg border border-red-200">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Username */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition duration-200"
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
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Admin Type</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition duration-200"
                      value={admintype}
                      onChange={(e) => {
                         setAdminType(e.target.value);
                         if (e.target.value === 'admin') {
                           setFaculty("");
                           setDepartment("");
                         }
                      }}
                      required
                    >
                      <option value="">Select Admin Type</option>
                      <option value="admin">Admin (System)</option>
                      <option value="advisor">Academic Advisor</option>
                      <option value="hod">HOD</option>
                      <option value="dean">Dean</option>
                    </select>
                  </div>

                  {/* Faculty */}
                  {admintype && admintype !== "admin" && (
                    <div className={admintype === 'dean' ? "md:col-span-2" : ""}>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Faculty</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition duration-200"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        required
                      >
                        <option value="">Select a Faculty</option>
                        <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                        <option value="Faculty of Business Studies">Faculty of Business Studies</option>
                        <option value="Faculty of Technological Studies">Faculty of Technological Studies</option>
                      </select>
                    </div>
                  )}

                  {/* Department */}
                  {(admintype === "advisor" || admintype === "hod") && (
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition duration-200"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      >
                        <option value="">Select a Department</option>
                        <option value="Department of Physical Science">Department of Physical Science</option>
                        <option value="Department of Bio Science">Department of Bio Science</option>
                        <option value="Business Economics">Business Economics</option>
                        <option value="English Language Teaching">English Language Teaching</option>
                        <option value="Finance and Accountancy">Finance and Accountancy</option>
                        <option value="Human Resource Management">Human Resource Management</option>
                        <option value="Management and Entrepreneurship">Management and Entrepreneurship</option>
                        <option value="Marketing Management">Marketing Management</option>
                        <option value="Project Management">Project Management</option>
                        <option value="Department of ICT">Department of ICT</option>
                      </select>
                    </div>
                  )}

                  {/* Password Fields */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md transform transition-all duration-200 hover:scale-[1.01] font-bold text-lg"
                  >
                    Register Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      {/* Footer */}
        <div className="bg-[#670047]">
            <hr className="border-gray-400 opacity-20" />
            <div className="px-5 sm:px-10 py-8">
              <Footer />
            </div>
        </div> 
    </div>
  );
}