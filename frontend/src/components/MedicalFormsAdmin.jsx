import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

export default function MedicalFormsAdmin() {
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Admin sees only forms approved by Advisor
  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/approvalForms/admin/any/any`);
      console.log("Fetched admin forms:", res.data.forms);
      setForms(res.data.forms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleApproval = async (formId, action) => {
    try {
      await axios.post(`http://localhost:8080/api/approveForm/admin/${formId}`, {
        status: action,
        username,
      });

      setForms((prev) =>
        prev.map((f) =>
          f._id === formId
            ? { ...f, adminApproval: { ...f.adminApproval, status: action } }
            : f
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (role, status) => {
    let colorClass = "bg-gray-100 text-gray-600"; 
    
    if (status === "Approved") colorClass = "bg-green-100 text-green-700 border-green-200";
    else if (status === "Rejected") colorClass = "bg-red-100 text-red-700 border-red-200";
    else if (status === "Pending") colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";

    return (
      <div className={`flex flex-col p-2 rounded-lg border ${colorClass} text-center`}>
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">{role}</span>
        <span className="font-semibold text-xs md:text-sm">{status}</span>
      </div>
    );
  };

  // filtering
  const filteredForms = forms.filter((f) => 
    f.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <Navbar/>
      </div>

      <div className="min-h-screen flex flex-col bg-gray-50">
        
        <div className="flex-grow flex justify-center p-4 md:p-8">
          <div className="w-full md:w-5/6 lg:w-3/4 max-w-6xl">
            
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Admin (Doctor) Approval
                </h1>
                <hr className="mt-3 border-t-2 border-gray-200 w-full md:w-auto" />
              </div>
            </div>

            {/* search bar */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by Registration Number or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg animate-pulse">Loading forms...</p>
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                {searchTerm ? (
                   <p className="text-gray-500 text-lg">No students found matching "{searchTerm}"</p>
                ) : (
                   <p className="text-gray-500 text-lg">No forms pending approval.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredForms.map((f) => (
                  <div 
                    key={f._id} 
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                  >
                    <div className="bg-blue-50 p-4 border-b border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{f.name}</h2>
                        <p className="text-sm text-gray-600 font-medium">
                            {searchTerm ? (
                                <span className="bg-yellow-200 text-gray-900 px-1 rounded">{f.registrationNo}</span>
                            ) : (
                                f.registrationNo
                            )}
                        </p>
                      </div>
                      <div className="text-sm text-right hidden md:block">
                        <p className="font-semibold text-blue-800">{f.department}</p>
                        <p className="text-xs text-blue-600">{f.faculty}</p>
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                            Exam Title
                          </span>
                          <p className="mt-1 text-lg font-semibold text-gray-800">{f.examTitle}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Subjects Enrolled</h4>
                          <ul className="space-y-2">
                            {f.subjects
                              .filter((s) => s.subject || s.code || s.dateOfExam)
                              .map((s, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                  <span className="font-medium text-gray-800">{s.subject} <span className="text-gray-400">{s.code ? `(${s.code})` : ""}</span></span>
                                  <span className="text-gray-500">{s.dateOfExam ? new Date(s.dateOfExam).toLocaleDateString() : ""}</span>
                                </li>
                              ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-700 text-sm">Reason for Request:</h4>
                          <p className="text-gray-600 text-sm mt-1 italic">"{f.reason}"</p>
                        </div>

                        {f.otherDocs && (
                          <div className="mt-2">
                             <a
                              href={`http://localhost:8080/api/download/${f.otherDocs}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              📄 View Supporting Document
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6">
                        
                        <div className="mb-6">
                           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Current Status Flow</h4>
                           <div className="grid grid-cols-2 gap-2">
                             {getStatusBadge("Advisor", f.advisorApproval.status)}
                             {getStatusBadge("Admin", f.adminApproval.status)}
                             {getStatusBadge("HOD", f.hodApproval.status)}
                             {getStatusBadge("Dean", f.deanApproval.status)}
                           </div>
                        </div>

                        <div className="space-y-3 mt-auto">
                          <p className="text-xs text-center text-gray-400 mb-2">Take Action as Admin (Doctor)</p>
                          <button
                            onClick={() => handleApproval(f._id, "Approved")}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                          >
                            ✅ Approve Request
                          </button>
                          <button
                            onClick={() => handleApproval(f._id, "Rejected")}
                            className="w-full py-2.5 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                          >
                            ❌ Reject Request
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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