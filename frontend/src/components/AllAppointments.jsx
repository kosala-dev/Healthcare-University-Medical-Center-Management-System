import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

export default function AllAppointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAppointments, setShowAppointments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/appointments");
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching appointments: " + err.message);
      setLoading(false);
    }
  };

const handleSelectAppointment = async (appointment) => {
  try {
    await axios.delete(`http://localhost:8080/appointments/${appointment._id}`);
    setAppointments(prev => prev.filter(item => item._id !== appointment._id));
    navigate("/medicalhistory", { 
      state: { preFilledRegNo: appointment.regnum } 
    });
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Could not process appointment. Please check if the backend is running.");
  }
};

  const filteredAppointments = appointments.filter((appointment) => {
    return (
      appointment.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.regnum.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          All Appointments
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search by Patient Registration num or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setShowAppointments(!showAppointments)}
              className="mt-4 block w-full sm:w-auto px-6 py-3 bg-[#670047] text-white font-semibold rounded-lg shadow-md hover:bg-[#670047]  transition-all"
            >
              {showAppointments ? "Hide Appointments" : "View Appointments"}
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {showAppointments && !loading && !error && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gradient-to-r from-[#4A0033] to-[#670047]">
                <tr>
                  <th className="px-4 py-2 text-white font-semibold">Reg No</th>
                  <th className="px-4 py-2 text-white font-semibold">Name</th>
                  <th className="px-4 py-2 text-white font-semibold">Email</th>
                  <th className="px-4 py-2 text-white font-semibold">Date</th>
                  <th className="px-4 py-2 text-white font-semibold">Time</th>
                  <th className="px-4 py-2 text-white font-semibold">Condition</th>
                  <th className="px-4 py-2 text-white font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {appointment.regnum}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {appointment.fullname}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {appointment.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {appointment.date}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {appointment.time}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {appointment.condition}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleSelectAppointment(appointment)}
                          className="px-4 py-1 bg-[#670047]  text-white rounded-lg hover:bg-[#670047] transition-colors"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 py-4">
                      No matching appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-[#670047]">
        <hr className="border-gray-400 opacity-20" />
        <div className="px-5 sm:px-10 py-8">
          <Footer />
        </div>
      </div>
    </>
  );
}