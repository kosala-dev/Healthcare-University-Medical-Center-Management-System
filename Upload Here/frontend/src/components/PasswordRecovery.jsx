import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PasswordRecovery = () => {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/password-recovery", {
        
        email,
        newPassword,
        confirmPassword
      });

      Swal.fire("Success", response.data.message, "success");

      // Clear form
     
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Patient Password Recovery
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your Email, then set your new password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
        
          
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Registered Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default PasswordRecovery;
