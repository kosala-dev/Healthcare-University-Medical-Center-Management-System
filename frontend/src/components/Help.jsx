import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Help = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <>
    <div>
        <Navbar/>
    </div> <br/>

    <section className="bg-gradient-to-b from-indigo-50 to-purple-50 min-h-screen py-12 relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 pt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to the Help Center!
            If you have any questions, concerns, or need assistance with our services, you’re in the right place. 
            Our team is here to guide you, whether you need technical support, help with submitting forms, or general 
            information. Feel free to reach out—we’re always ready to support you and ensure you have a smooth experience.
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Content */}
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Contact Details
            </h3>

            <div className="space-y-4 text-gray-600">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-lg leading-relaxed">
                  <span className="font-semibold text-blue-700">Help Desk:</span> 
                  Admin
                </p>
                <p className="text-lg leading-relaxed">
                  <span className="font-semibold text-blue-700">E-mail:</span>
                  <a
                    href="mailto:helpdesk@vau.ac.lk"
                    className="text-cyan-600 hover:text-cyan-800 font-medium ml-1 transition-colors"
                  >
                    medicalcenteruov@gmail.com
                  </a>
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-blue-700">Tel:</span> 024
                  2224680
                </p>
              </div>

              <p className="text-lg leading-relaxed">
                If you have any questions or need assistance, feel free to
                contact our help desk team. We are here to provide support and
                resolve any issues you may encounter.
              </p>

              {expanded && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-lg leading-relaxed">
                    We offer assistance with the following:
                  </p>
                  <ul className="list-disc pl-6 text-lg leading-relaxed">
                    <li>Appointment scheduling issues</li>
                    <li>Technical support for medical records access</li>
                    <li>Guidance on patient history retrieval</li>
                    <li>Medication and supply information</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 flex items-center gap-2"
              >
                {expanded ? "Show Less" : "Read More"}
              </button>

              <div className="flex space-x-2">
                <a
                  href="#"
                  className="text-gray-500 hover:text-cyan-600 transition-colors p-3 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-400 transition-colors p-3 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-red-600 transition-colors p-3 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
              <img
                src="/src/assets/logo.png"
                alt="Help & Support Logo"
                className="w-full h-auto object-contain"
                style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Medical Center Support
                </h3>
                <p className="text-gray-600">
                  Providing assistance for all medical center management system queries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="footer px-5 sm:px-10 bg-[#670047] mt-8">
        <hr className="my-12 border-2 border-gray-300" />
          <Footer />
    </div>
    </>
  );
};

export default Help;
