import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AllAppointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAppointments, setShowAppointments] = useState(true);
  const navigate = useNavigate();

  // Fetch appointments from backend
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/Appointments/");
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching appointments: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Navigate to update appointment page
  const onUpdate = (appointment) => {
    localStorage.setItem("id", appointment._id);
    localStorage.setItem("regnum", appointment.regnum);
    localStorage.setItem("fullname", appointment.fullname);
    localStorage.setItem("email", appointment.email);
    localStorage.setItem("date", appointment.date);
    localStorage.setItem("time", appointment.time);
    localStorage.setItem("condition", appointment.condition);

    navigate("/update-appoinment");
  };

  // Filter appointments based on search
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.regnum.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Appointments
      </h1>

      {/* Search and toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by Registration Number or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowAppointments(!showAppointments)}
            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            {showAppointments ? "Hide Appointments" : "View Appointments"}
          </button>
          <button
            onClick={getData}
            className="mt-4 sm:mt-2 ml-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {showAppointments && !loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
              <tr>
                <th className="px-4 py-2 text-white font-semibold text-center">Registration Number</th>
                <th className="px-4 py-2 text-white font-semibold text-center">Patient Name</th>
                <th className="px-4 py-2 text-white font-semibold text-center">Email</th>
                <th className="px-4 py-2 text-white font-semibold text-center">Date</th>
                <th className="px-4 py-2 text-white font-semibold text-center">Time</th>
                <th className="px-4 py-2 text-white font-semibold text-center">Condition</th>
                <th className="px-4 py-2 text-white font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-100 transition-all duration-200">
                    <td className="border border-gray-300 px-4 py-2 text-center">{appointment.regnum}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{appointment.fullname}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{appointment.email}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{appointment.date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{appointment.time}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{appointment.condition}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => onUpdate(appointment)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4 font-medium">
                    No matching appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}