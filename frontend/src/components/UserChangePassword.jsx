import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

const UserChangePassword = () => {
  const [formData, setFormData] = useState({
    regnum: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/changepassword/change-password",
        formData
      );
      alert(response.data.message);
      navigate("/logout");
    } catch (error) {
      alert(error.response?.data?.message || "Error changing password");
    }
  };

return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Navbar Section */}
      <div>
        <Navbar/>
      </div>

      {/* Main Content - Centered with flex-grow */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl"> {/* Slightly wider max-width for side-by-side cards */}
          
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
              User | Change Password
            </h1>
            <hr className="mt-3 border-t-2 border-gray-200" />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Grid stacks on mobile (cols-1), becomes side-by-side on desktop (md:cols-2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Account Info Card */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                   🔐 Account Information
                </h2>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="regnum"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Registration Number
                    </label>
                    <input
                      type="text"
                      id="regnum"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter your registration number"
                      value={formData.regnum}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter your current password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* New Password Card */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                   🔑 New Credentials
                </h2>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter your new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center md:justify-end">
              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-lg shadow-md hover:scale-105"
              >
                Update Password
              </button>
            </div>
          </form>

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
};

export default UserChangePassword;