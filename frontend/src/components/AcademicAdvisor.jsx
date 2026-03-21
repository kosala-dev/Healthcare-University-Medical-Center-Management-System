import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function AcademicAdvisorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // get the username from sessions or navigation
  const username =
    location.state?.username || sessionStorage.getItem("username");

  const [advisorDetails, setAdvisorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      alert("Session is over. Please login again.");
      navigate("/login");
      return;
    }

    // store username in sessions
    sessionStorage.setItem("username", username);

    axios
      .get(`http://localhost:8080/auth/admindetails/${username}`, {
        withCredentials: true,
      })
      .then((response) => {
        setAdvisorDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching advisor details:", error);
        alert("Session is over. Please login again.");
        sessionStorage.clear();
        navigate("/login");
      });
  }, [username, navigate]);

  const goAdvisorApproval = () => {
    if (!advisorDetails) {
      alert("Please wait, loading advisor details...");
      return;
    }

    navigate("/medicalFormsAdvisor", {
      state: {
        username: advisorDetails.username,
        faculty: advisorDetails.faculty,
        department: advisorDetails.department,
      },
    });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      {/* sidebar */}
      <div
        className="w-full md:w-1/4 p-6 md:p-8 flex flex-col justify-between shadow-lg md:shadow-none"
        style={{
          background: "linear-gradient(to bottom, #670047, #a2005a)",
        }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>
        </div>

        <div className="mt-6 md:mt-0">
          <button
            onClick={handleLogout}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* main */}
      <div className="w-3/4 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Welcome, {advisorDetails?.username}'s Dashboard
        </h1>

        <div
          className="bg-white rounded-lg shadow-md hover:scale-105 transition cursor-pointer"
          onClick={goAdvisorApproval}
        >
          <img
            src="/card_images/patient.jpg"
            alt="Medical Forms"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-6">
            <h2 className="text-xl font-bold">Medical Forms</h2>
            <p className="text-gray-500 mt-2">
              Review student forms approved by Doctor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

