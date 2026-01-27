import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Admindashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // taking the gender and username
  const { username: stateUsername, gender: stateGender } = location.state || {};
  const [admin, setAdminDetails] = useState({
    username: stateUsername || "",
    gender: stateGender || "",
    admintype: "Loading...",
    createdAt: null,
  });
  const [notifications, setNotifications] = useState([]);

  // admin details 
  useEffect(() => {
    const fetchUsername = stateUsername || sessionStorage.getItem("username");
    
    if (fetchUsername) {
      axios
        .get(`http://localhost:8080/auth/admindetails/${fetchUsername}`)
        .then((response) => {
          setAdminDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    }
  }, [stateUsername]);

  // notifications
  useEffect(() => {
    const fetchNotifications = () => {
      axios
        .get("http://localhost:8080/api/notifications")
        .then((response) => setNotifications(response.data))
        .catch((error) => console.error("Error fetching notifications:", error));
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const lowStockNotifications = notifications.filter((n) => n.type === "low_stock");

  const goAdminApproval = () => {
    navigate("/medicalFormsAdmin", { state: { username: admin.username } });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>

          <div className="mt-8 text-white">
            <p className="text-sm font-medium mt-4">
              Name: <span className="font-bold">{admin.username || "Guest"}</span>
            </p>
            <p className="text-sm font-medium mt-2">
              Type: <span className="font-bold ">{admin.admintype}</span>
            </p>
            <p className="text-sm font-medium mt-2">
              Gender: <span className="font-bold">{admin.gender || "Not Specified"}</span>
            </p>
            <p className="text-sm font-medium mt-2">
              Account Created:{" "}
              <span className="font-bold text-sm">
                {admin.createdAt 
                  ? new Date(admin.createdAt).toLocaleDateString() 
                  : "Loading..."}
              </span>
            </p>

            {lowStockNotifications.length > 0 && (
              <div className="mt-6 bg-red-100 text-red-700 p-3 rounded-lg shadow-inner">
                <h3 className="font-bold mb-2 text-xs">
                  Low Stock Alerts ({lowStockNotifications.length})
                </h3>
                <ul className="list-disc list-inside text-[10px] leading-tight">
                  {lowStockNotifications.map((n) => (
                    <li key={n._id}>{n.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-[#670047] py-2 px-4 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            Back to home
          </button>
        </div>
      </div>

      <div className="w-3/4 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 uppercase">
            Welcome {admin.username}'s Dashboard
          </h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer overflow-hidden"
            onClick={() => navigate("/AllAppointments")}
          >
            <img src="/card_images/appointment.jpg" alt="Appointments" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">Appointments</h2>
              <p className="text-xs text-gray-500 mt-1">Manage patient bookings and schedules.</p>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer overflow-hidden"
            onClick={() => navigate("/patientdetails")}
          >
            <img src="/card_images/patient.jpg" alt="Patient Details" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">Patient Details</h2>
              <p className="text-xs text-gray-500 mt-1">View comprehensive patient information.</p>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer overflow-hidden"
            onClick={() => navigate("/medicalhistoryform")}
          >
            <img src="/card_images/prescription.jpg" alt="Add History" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 leading-tight">Add Prescription/Diagnosis</h2>
              <p className="text-xs text-gray-500 mt-1">Record new clinical findings and prescriptions.</p>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer overflow-hidden"
            onClick={() => navigate("/diagnosisdetails")}
          >
            <img src="/card_images/OIP.webp" alt="View History" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">View History</h2>
              <p className="text-xs text-gray-500 mt-1">Browse all historical diagnostic records.</p>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer overflow-hidden"
            onClick={() => navigate("/drugs")}
          >
            <img src="/card_images/drug.jpg" alt="Drugs" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">Drug Management</h2>
              <p className="text-xs text-gray-500 mt-1">Monitor pharmacy inventory and drug logs.</p>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer overflow-hidden"
            onClick={goAdminApproval}
          >
            <img src="/card_images/form.jpg" alt="Forms" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">Medical Forms</h2>
              <p className="text-xs text-gray-500 mt-1">Approve or review submitted medical requests.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}