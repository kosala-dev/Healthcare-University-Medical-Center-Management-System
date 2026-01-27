import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2"; 

export default function Medicalhistory() {
  const [medicalHistories, setMedicalHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRegNo, setFilterRegNo] = useState("");
  const navigate = useNavigate();

  const fetchData = () => {
    axios
      .get("http://localhost:8080/medicalhis/medical-history-get")
      .then((res) => {
        const sorted = res.data.sort((a, b) => a.regNo.localeCompare(b.regNo));
        setMedicalHistories(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medical histories:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkDone = async (id) => {
    try {
      await axios.put(`http://localhost:8080/medicalhis/update-status/${id}`, {
        status: "Done",
      });
      
      setMedicalHistories((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Done" } : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Completed",
        text: "Medicines marked as given!",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const filteredHistories = medicalHistories.filter((h) =>
    h.regNo.toLowerCase().includes(filterRegNo.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div>
        <Navbar />
      </div>

      <div className="flex-grow flex justify-center p-4 md:p-8">
        <div className="w-full max-w-7xl">
          
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Patient Medical Histories
              </h1>
              <div className="h-1 w-20 bg-teal-500 mt-2 rounded"></div>
            </div>

            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="🔍 Filter by Registration Number..."
                value={filterRegNo}
                onChange={(e) => setFilterRegNo(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg animate-pulse">Loading records...</p>
            </div>
          ) : filteredHistories.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 text-lg">No medical records found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-teal-600 text-white uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Reg No</th>
                      <th className="px-6 py-4">Diagnosis</th>
                      <th className="px-6 py-4">Prescription</th>
                      <th className="px-6 py-4">Visit Date</th>
                      <th className="px-6 py-4 text-center">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistories.map((h, idx) => (
                      <tr 
                        key={idx} 
                        className={`transition-colors duration-150 ${h.status === "Done" ? "bg-green-50" : "hover:bg-teal-50"}`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{h.regNo}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs font-semibold">
                            {h.diagnosis}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">
                          {h.prescription || "No drugs prescribed"}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(h.visitDate).toLocaleDateString()}
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          {h.status === "Done" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              ✅ Medicines Given
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkDone(h._id)}
                              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all transform hover:scale-105"
                            >
                              Mark as Done
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#670047]">
        <hr className="border-gray-400 opacity-20" />
        <div className="px-5 sm:px-10 py-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}