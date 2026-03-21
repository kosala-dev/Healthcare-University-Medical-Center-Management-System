import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

export default function MedicalFormsAdmin() {
  const location = useLocation();
  const username = localStorage.getItem("username") || "Admin/Doctor";
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedForm(null);
    setIsModalOpen(false);
  };

  // admin
  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/approvalForms/admin/any/any`);
      setForms(res.data.forms);
    } catch (err) {
      console.error("Error fetching forms for Admin:", err);
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

      setForms((prev) => prev.filter((f) => f._id !== formId));
      
      alert(`Form ${action} successfully.`);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to process approval.");
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

  const filteredForms = forms.filter((f) =>
    f.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow flex justify-center p-4 md:p-8">
          <div className="w-full md:w-5/6 lg:w-3/4 max-w-6xl">
            
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Medical Center: Doctor Approval
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by Registration Number or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading new submissions...</p>
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? `No results for "${searchTerm}"` : "All caught up! No pending forms."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredForms.map((f) => (
                  <div key={f._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                    {/* Header */}
                    <div className="bg-blue-50 p-4 border-b border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{f.name}</h2>
                        <p className="text-sm text-blue-700 font-mono">{f.registrationNo}</p>
                      </div>
                      <div className="text-sm text-right mt-2 md:mt-0">
                        <p className="font-semibold text-gray-700">{f.faculty}</p>
                        <p className="text-xs text-gray-500">{f.department}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase">Examination</span>
                          <p className="text-lg font-semibold text-gray-800">{f.examTitle}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h4 className="font-bold text-gray-700 mb-2 text-sm">Requested Subjects</h4>
                          <ul className="space-y-1">
                            {f.subjects?.map((s, idx) => (
                              <li key={idx} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                                <span>{s.subject} <span className="text-gray-400">({s.code})</span></span>
                                <span className="text-gray-500">{s.dateOfExam}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-700 text-sm">Medical Reason:</h4>
                          <p className="text-gray-600 text-sm mt-1 italic bg-yellow-50 p-2 rounded">"{f.reason}"</p>
                        </div>

                    {f.otherDocs && (
                      <div className="flex gap-4 items-center">
                        <a
                          href={`http://localhost:8080/api/download/${f.otherDocs}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
                        >
                          📄 View Medical Certificate
                        </a>
                        
                        <button
                          onClick={() => openModal(f)}
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium border-l pl-4 border-gray-300"
                        >
                          👁️ View Full Application
                        </button>
                      </div>
                    )}
                      </div>

                      {/* Action Sidebar */}
                      <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6">
                        <div className="mb-6">
                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Workflow Status</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {getStatusBadge("Doctor", f.adminApproval.status)}
                            {getStatusBadge("Advisor", f.advisorApproval.status)}
                            {getStatusBadge("HOD", f.hodApproval.status)}
                            {getStatusBadge("Dean", f.deanApproval.status)}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => handleApproval(f._id, "Approved")}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-sm transition-all"
                          >
                            Confirm & Approve
                          </button>
                          <button
                            onClick={() => handleApproval(f._id, "Rejected")}
                            className="w-full py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold transition-all"
                          >
                            Reject Request
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

      <div className="bg-[#670047] px-5 sm:px-10 py-8">
        <Footer />
      </div>

      {isModalOpen && (
        <ViewFormModal 
          form={selectedForm} 
          onClose={closeModal} 
        />
      )}
    </>
  );
}

function ViewFormModal({ form, onClose }) {
  if (!form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative">
        
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="font-bold text-gray-700">Application Preview: {form.registrationNo}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-2xl">&times;</button>
        </div>

        <div className="p-8 bg-white" id="admin-view-content">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">University Of Vavuniya</h1>
            <h2 className="font-bold text-sm mt-2 uppercase">Application for consideration of absence from examinations</h2>
          </div>

          <div className="space-y-4 text-sm border-t pt-6">
            <p><strong>1) Name:</strong> {form.name}</p>
            <p><strong>2) Address:</strong> {form.address}</p>
            <div className="grid grid-cols-2 gap-4">
               <p><strong>3) Contact:</strong> {form.contact}</p>
               <p><strong>4) Reg No:</strong> {form.registrationNo}</p>
            </div>
            <p><strong>5) Faculty:</strong> {form.faculty} ({form.department})</p>
            <p><strong>6) Exam:</strong> {form.examTitle}</p>

            <div className="mt-4">
              <p className="font-bold mb-2">7) Details of course units:</p>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Subject</th>
                    <th className="border p-2 text-left">Code</th>
                    <th className="border p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {form.subjects?.map((s, i) => (
                    <tr key={i}>
                      <td className="border p-2">{s.subject}</td>
                      <td className="border p-2">{s.code}</td>
                      <td className="border p-2">{s.dateOfExam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4"><strong>8) Reason:</strong> {form.reason}</p>
            <p><strong>9) Student Request:</strong> {form.studentRequest}</p>
            <p><strong>10) First Attempt:</strong> {form.firstAttempt} {form.firstAttemptDetails && `- ${form.firstAttemptDetails}`}</p>
            
            <div className="mt-10 p-4 bg-blue-50 border border-blue-200 rounded">
               <p className="italic">"I confirm that the above facts are correct."</p>
               <p className="font-bold mt-2">Digitally Signed by: {form.name}</p>
               <p className="text-xs text-gray-500">Submitted on: {new Date(form.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}