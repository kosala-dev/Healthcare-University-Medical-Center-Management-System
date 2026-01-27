import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewsSection from "../components/NewsSection";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home({ role, userId }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); 

  
  useEffect(() => {
    const fetchPatientCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/patient/countpatients"
        ); 
        setPatientCount(response.data.count ?? 0);
      } catch (error) {
        console.error("Error fetching patient count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientCount();

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      checkOpeningHours(now); 
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkOpeningHours = (now) => {
    const day = now.getDay(); 
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (day === 0) {
      setIsOpen(false);
    } else if (day === 6) {
      if (hours >= 9 && hours < 12) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      if ((hours > 8 || (hours === 8 && minutes >= 30)) && hours < 16) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  };

  if (loading) {
    return <div>please wait...</div>;
  }

  return (
    <>
      <div className="w-full h-fit bg-gradient-to-tl from-blue-100 to-purple-100">
        <Navbar role={role} userId={userId}></Navbar>
      </div> <br/>

      <div className="w-full flex flex-col sm:flex-row items-center px-5 sm:px-10 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          className="w-full sm:w-1/2 h-[200px] sm:h-[300px] object-cover rounded-lg shadow-lg"
          src="/src/assets/images/home.png"
          alt="Healthcare"
        />
        <div className="w-full sm:w-1/2 flex flex-col items-center text-center sm:text-left mt-5 sm:mt-0 sm:pl-8">
          <h1 className="font-semibold text-3xl sm:text-4xl text-white">
            Medical Center
          </h1>
          <h1 className="text-white font-bold text-4xl sm:text-5xl mt-2">
            University of Vavuniya
          </h1>
          <h1 className="text-white text-lg sm:text-xl mt-4">
            We are here to provide healthcare to everyone in the University
          </h1>
        </div>
      </div>

      <div className="bg-white font-medium rounded-lg shadow-lg p-6 mt-8 mx-4 sm:mx-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col justify-center items-start space-y-4">
          <h1 className="text-blue-900 text-3xl sm:text-4xl font-semibold">
            Time:{" "}
            <span className="text-gray-700">
              {currentTime.toLocaleTimeString()}
            </span>
          </h1>
          <h1 className="text-blue-900 text-3xl sm:text-4xl font-semibold">
            Date:{" "}
            <span className="text-gray-700">
              {currentTime.toLocaleDateString()}
            </span>
          </h1>
          <h1
            className={`text-3xl sm:text-4xl font-semibold ${
              isOpen ? "text-green-900" : "text-red-900"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </h1>
        </div>

        <div className="flex justify-center items-center">
          <h1 className="text-red-800 text-2xl sm:text-3xl font-semibold">
            Total Number of Patients:{" "}
            <span className="text-black">{patientCount}</span>
          </h1>
        </div>
      </div><br/>

      <div>
        <NewsSection/>
      </div>
            
    
      <div className="footer px-5 sm:px-10 bg-[#670047] mt-8">
        <hr className="my-12 border-2 border-gray-300" />
        <Footer />
      </div>
    </>
  );
}
