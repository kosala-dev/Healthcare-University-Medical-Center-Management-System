import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

export default function MedicalFormsPatient() {
  const location = useLocation();
  const { regnum } = location.state;

  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/getFormsByStudent/${regnum}`)
      .then((res) => setForms(res.data.forms))
      .catch((err) => console.error(err));
  }, [regnum]);

  const getStatusBadge = (role, status) => {
    let colorClass = "bg-gray-100 text-gray-600"; 
    
    if (status === "Approved") colorClass = "bg-green-100 text-green-700 border-green-200";
    else if (status === "Rejected") colorClass = "bg-red-100 text-red-700 border-red-200";
    else if (status === "Pending") colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";

    return (
      <div className={`flex flex-col p-2 rounded-lg border ${colorClass} text-center`}>
        <span className="text-xs font-bold uppercase tracking-wide opacity-80">{role}</span>
        <span className="font-semibold text-sm">{status}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <div>
        <Navbar/>
      </div>

      <div className="flex-grow flex justify-center p-4 md:p-8">
        <div className="w-full md:w-3/4 lg:w-2/3 max-w-5xl">
          
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Medical Forms
            </h1>
            <hr className="mt-3 border-t-2 border-gray-200" />
          </div>

          {forms.length === 0 && (
             <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-lg">No medical forms submitted yet.</p>
             </div>
          )}

          <div className="space-y-6">
            {forms.map((f) => (
              <div 
                key={f._id} 
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-blue-900 mb-1">
                    {f.examTitle || "Untitled Exam"}
                  </h3>
                  <div className="text-gray-600">
                    <span className="font-semibold text-gray-800">Subjects: </span> 
                    {f.subjects && f.subjects.length > 0 
                      ? f.subjects.map(s => s.subject).join(", ") 
                      : "No subjects listed"}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Approval Status</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getStatusBadge("Advisor", f.advisorApproval.status)}
                    {getStatusBadge("Admin", f.adminApproval.status)}
                    {getStatusBadge("HOD", f.hodApproval.status)}
                    {getStatusBadge("Dean", f.deanApproval.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
