import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-12 relative">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in using your university email to access the system
          </p>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-3 px-4 bg-[#670047] text-white font-semibold rounded-md transition duration-200 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-6 h-6 mr-3"
              aria-hidden="true"
            >
              <path
                fill="#FFC107"
                d="M43.6,20.5H42V20H24v8h11.3C33.6,32.7,29.2,36,24,36c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.9,1.2,8,3.1l5.7-5.7C34.1,6.1,29.3,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20s20-8.9,20-20C44,22.7,43.9,21.6,43.6,20.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3,14.7l6.6,4.8C14.7,15.6,18.9,12,24,12c3.1,0,5.9,1.2,8,3.1l5.7-5.7C34.1,6.1,29.3,4,24,4C16.3,4,9.7,8.3,6.3,14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.2,0,10-2,13.6-5.3l-6.3-5.2C29.3,35.1,26.8,36,24,36c-5.2,0-9.6-3.3-11.3-8l-6.5,5C9.5,39.5,16.2,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.6,20.5H42V20H24v8h11.3c-1.1,3.1-3.2,5.1-4,5.7l6.3,5.2C37.1,39.3,44,34,44,24C44,22.7,43.9,21.6,43.6,20.5z"
              />
            </svg>
            Sign in with Google
          </button>

          <p className="text-gray-500 mt-6 text-sm">
            Only university emails ending with <strong>@vau.ac.lk</strong> or{" "}
            <strong>@stu.vau.ac.lk</strong> are allowed.
          </p>
        </div>
      </div>

      <div className="footer px-5 sm:px-10 bg-[#670047] mt-8">
        <hr className="my-12 border-2 border-gray-300" />
        <Footer />
      </div>
    </>
  );
}
