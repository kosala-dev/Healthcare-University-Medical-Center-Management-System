import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function UpdateAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = location.state || {};
  const [username] = useState(adminData.username || "");
  const [gender, setGender] = useState(adminData.gender || "");
  const [admintype, setAdminType] = useState(adminData.admintype || "");
  const [faculty, setFaculty] = useState(adminData.faculty || "");
  const [department, setDepartment] = useState(adminData.department || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // password validation
    if (password && password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // faculty validation
    if (admintype !== "admin" && !faculty) {
      setErrorMessage("Please select a Faculty.");
      return;
    }

    // department validation
    if ((admintype === "advisor" || admintype === "hod") && !department) {
      setErrorMessage("Please select a Department.");
      return;
    }

    const updateData = {
      gender,
      admintype,
    };

    if (admintype !== "admin") {
      updateData.faculty = faculty;
    }

    if (admintype === "advisor" || admintype === "hod") {
      updateData.department = department;
    }

    if (password) {
      updateData.password = password;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/auth/updateAdmin/${username}`,
        updateData
      );

      if (response.status === 200) {
        setSuccessMessage("Administrator updated successfully!");
        setErrorMessage("");
        setTimeout(() => navigate("/superadmindashboard"), 2000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error updating administrator.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">

        <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between shadow-lg">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Medical Center University of Vavuniya
            </h1>
            <p className="text-sm text-white mt-2">
              Secure and Reliable Healthcare Services
            </p>
          </div>

          <button
            onClick={() => navigate("/superadmindashboard")}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="w-full md:w-3/4 p-4 md:p-8">

          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Update Administrator Details
            </h1>
            <hr className="mt-2 border-t-2 border-gray-200" />
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">

            {successMessage && (
              <div className="mb-4 text-green-600 text-center bg-green-50 p-3 rounded">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 text-red-500 text-center bg-red-50 p-3 rounded">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="w-full p-3 border rounded-lg"
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

              <div>
                <label className="block text-sm font-medium mb-1">Admin Type</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={admintype}
                  onChange={(e) => {
                    setAdminType(e.target.value);
                    if (e.target.value === "admin") {
                      setFaculty("");
                      setDepartment("");
                    }
                  }}
                  required
                >
                  <option value="">Select Admin Type</option>
                  <option value="admin">Admin</option>
                  <option value="advisor">Advisor</option>
                  <option value="hod">HOD</option>
                  <option value="dean">Dean</option>
                </select>
              </div>

              {admintype && admintype !== "admin" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Faculty</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    required
                  >
                    <option value="">Select Faculty</option>
                    <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                    <option value="Faculty of Business Studies">Faculty of Business Studies</option>
                    <option value="Faculty of Technological Studies">Faculty of Technological Studies</option>
                  </select>
                </div>
              )}

              {(admintype === "advisor" || admintype === "hod") && (
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
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

              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {password && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold"
              >
                Update Administrator
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
