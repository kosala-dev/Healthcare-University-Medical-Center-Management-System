import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard({ username }) {
  const [admin, setAdminDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/auth/admindetails/${username}`)
      .then((res) => {
        if (res.data.success) setAdminDetails(res.data.admindet);
      })
      .catch((err) => console.error(err));
  }, [username]);

  const goPatientDetails = () => navigate("/patientdetails");
  const goAddMedicalHistory = () => navigate("/medicalhistoryform");
  const goUserMessages = () => navigate("/usermessages");
  const goDrugDetails = () => navigate("/drugs");
  const goAppointments = () => navigate("/AllAppointments");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm md:text-base text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>

          <div className="mt-6 text-white space-y-2">
            <p>
              Name: <span className="font-bold">{admin.username}</span>
            </p>
            <p>
              Type: <span className="font-bold">{admin.admintype}</span>
            </p>
            <p>
              Gender: <span className="font-bold">{admin.gender}</span>
            </p>
            <p>
              Account Created:{" "}
              <span className="font-bold text-sm">
                {admin.createdAt ? new Date(admin.createdAt).toLocaleString() : ""}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
          >
            Back to home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Welcome {username}'s Dashboard
          </h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Appointments */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goAppointments}
          >
            <img
              src="/card_images/appointment.jpg"
              alt="Appointments"
              className="w-full h-40 md:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Appointments
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">
                Click Here to Show Patient Appointments
              </p>
            </div>
          </div>

          {/* Patient Details Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goPatientDetails}
          >
            <img
              src="/card_images/patient.jpg"
              alt="Patient Details"
              className="w-full h-40 md:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Patient Details
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">
                Click Here to Show Patient Details
              </p>
            </div>
          </div>

          {/* User Messages Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goUserMessages}
          >
            <img
              src="/card_images/msg.jpg"
              alt="User Messages"
              className="w-full h-40 md:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                User Messages
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">
                Click Here to Show User Messages
              </p>
            </div>
          </div>

          {/* Add Medical History Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goAddMedicalHistory}
          >
            <img
              src="/card_images/prescription.jpg"
              alt="Add Medical History"
              className="w-full h-40 md:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Add Prescription/Diagnosis
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">
                Click Here to Add Patient Prescription / Diagnosis
              </p>
            </div>
          </div>

          {/* View Medical History Card
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goMedicalHistory}
          >
            <img
              src="/card_images/prescription.jpg"
              alt="Medical History"
              className="w-full h-40 md:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Prescription/Diagnosis
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">
                Click Here to See Patient Prescription / Diagnosis
              </p>
            </div>
          </div> */}

          {/* Drug Details Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goDrugDetails}
          >
            <img
              src="/card_images/drug.jpg"
              alt="Drug Details"
              className="w-full h-40 md:h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Drug Management
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">
                Click Here to See Drug/Details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
