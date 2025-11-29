import { useNavigate } from "react-router-dom";

export default function SuperAdmindashboard({ username }) {
  const navigate = useNavigate();

  const gopatientdetails = () => {
    navigate("/patientdetails");
  };

  const goAdminregister = () => {
    navigate("/registeradmin");
  };

  const goRegisterPatient = () => {
    navigate("/registerpatientadmin");
  };

  const goAdminDetails = () => {
    navigate("/admindetails");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-1/4 p-8 flex flex-col justify-between"
       style={{background: "linear-gradient(to bottom, #670047, #a2005a)" // gradient from dark to lighter shade
     }}>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Back to home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome {username}'s Dashboard
          </h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patient Details Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={gopatientdetails}
          >
            <img
              src="/card_images/patient.jpg"
              alt="Patient Details"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
              <p className="text-sm text-gray-500 mt-2">
                Click Here to Show Patient Details
              </p>
            </div>
          </div>

          {/* Admin Details Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goAdminDetails}
          >
            <img
              src="/card_images/doctor.jpeg"
              alt="Admin Details"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">Admin Details</h2>
              <p className="text-sm text-gray-500 mt-2">
                Click Here to Show Admin/Doctors Details
              </p>
            </div>
          </div>

          {/* Register Admin Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goAdminregister}
          >
            <img
              src="/card_images/reg.jpg"
              alt="Register Admin"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">Register Admin</h2>
              <p className="text-sm text-gray-500 mt-2">
                Click Here to Register Admin
              </p>
            </div>
          </div>

          {/* Register Patient Card */}
          <div
            className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
            onClick={goRegisterPatient}
          >
            <img
              src="/card_images/register_patient.jpg"
              alt="Register Patient"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">Register Patient</h2>
              <p className="text-sm text-gray-500 mt-2">
                Click Here to Register Patient
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
