import { useNavigate, useLocation } from "react-router-dom";

export default function SuperAdmindashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || "Super Admin";

  const actions = [
    {
      title: "Patient Details",
      description: "Click here to show patient details",
      img: "/card_images/patient.jpg",
      onClick: () => navigate("/patientdetails"),
    },
    {
      title: "Admin Details",
      description: "Click here to show admin/doctors details",
      img: "/card_images/doctor.jpeg",
      onClick: () => navigate("/admindetails"),
    },
    {
      title: "Register Admin",
      description: "Click here to register admin",
      img: "/card_images/reg.jpg",
      onClick: () => navigate("/registeradmin"),
    },
    {
      title: "Register Patient",
      description: "Click here to register patient",
      img: "/card_images/register_patient.jpg",
      onClick: () => navigate("/registerpatientadmin"),
    },
    {
      title: "User Messages",
      description: "Click here to read user messages",
      img: "/card_images/msg.jpg",
      onClick: () => navigate("/usermessages"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome {username}'s Dashboard
          </h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md transform transition-all hover:scale-105 cursor-pointer"
              onClick={action.onClick}
            >
              <img
                src={action.img}
                alt={action.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 md:p-6">
                <h2 className="text-xl font-bold text-gray-800">{action.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
