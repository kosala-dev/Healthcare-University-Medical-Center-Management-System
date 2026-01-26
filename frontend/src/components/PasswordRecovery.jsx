import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 
import Navbar from "./Navbar";
import Footer from "../components/Footer";

const PasswordRecovery = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/patient/send-otp", {
        email,
      });

      Swal.fire("OTP Sent!", response.data.message, "success");
      setStep(2);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/patient/reset-password", {
        email,
        otp,
        newPassword,
      });

      await Swal.fire("Success", response.data.message, "success");
            navigate("/login"); 

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
      {/* Navbar Section */}
      <div>
        <Navbar/>
      </div>

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Patient Password Recovery
        </h1>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <p className="text-center text-gray-600 mb-6">
              Enter your registered email address. We will send you an OTP to reset your password.
            </p>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Registered Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
             <p className="text-center text-gray-600 mb-6">
              OTP sent to <strong>{email}</strong>. Please enter it below.
            </p>

            {/* OTP Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition text-sm underline"
            >
              Change Email
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-4 text-sm">
          Remember your password?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>

      {/* Footer */}
        <div className="bg-[#670047]">
            <hr className="border-gray-400 opacity-20" />
            <div className="px-5 sm:px-10 py-8">
              <Footer />
            </div>
        </div> 
    </>
  );
};

export default PasswordRecovery;