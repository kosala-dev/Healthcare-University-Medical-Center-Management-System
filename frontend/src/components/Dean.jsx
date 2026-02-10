import { useNavigate, useLocation } from "react-router-dom";

export default function DeanDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get username and faculty from navigation state
  const username = location.state?.username || "Dean";
  const faculty = location.state?.faculty || "Your Faculty";

  const goDeanApproval = () => {
    navigate("/medicalFormsDean", { state: { username, faculty } });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div
        className="w-1/4 p-8 flex flex-col justify-between"
        style={{ background: "linear-gradient(to bottom, #670047, #a2005a)" }}
      >
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
            onClick={() => navigate("/login")}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Welcome {username}'s Dashboard
        </h1>

        <div
          className="bg-white rounded-lg shadow-md hover:scale-105 transition cursor-pointer"
          onClick={goDeanApproval}
        >
          <img
            src="/card_images/patient.jpg"
            alt="Medical Forms"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-6">
            <h2 className="text-xl font-bold">Medical Forms</h2>
            <p className="text-gray-500 mt-2">
              Review student forms approved by HOD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
