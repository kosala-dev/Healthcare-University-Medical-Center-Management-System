/*import { useEffect, useState } from "react";
import axios from "axios";

export default function MedicalFormsTable({ role, faculty, department, username }) {
  const [forms, setForms] = useState([]);

  // Fetch forms from backend
  const fetchForms = () => {
    axios
      .get(`http://localhost:8080/api/approvalForms/${role}/${faculty || "any"}/${department || "any"}`)
      .then(res => setForms(res.data.forms))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchForms();
  }, [role, faculty, department]);

  // Handle approve/reject
  const handleApproval = (formId, action) => {
    axios.post(`http://localhost:8080/api/approveForm/${role}/${formId}`, {
      status: action,
      username
    })
    .then(() => fetchForms())
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Medical Forms</h2>
      {forms.length === 0 && <p>No forms to show</p>}
      <div className="space-y-4">
        {forms.map(f => (
          <div key={f._id} className="border p-4 rounded-lg shadow-sm bg-white">
            <p><strong>Student:</strong> {f.name}</p>
            <p><strong>Registration No:</strong> {f.registrationNo}</p>
            <p><strong>Exam:</strong> {f.examTitle}</p>
            <p><strong>Subjects:</strong> {f.subjects.map(s => s.subject).join(", ")}</p>
            <p><strong>Reason:</strong> {f.reason}</p>

            //Show approve/reject buttons only for roles who can approve 
            {["advisor","admin","hod","dean"].includes(role) && (
              <div className="mt-2 space-x-2">
                <button 
                  onClick={() => handleApproval(f._id, "Approved")}
                  className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleApproval(f._id, "Rejected")}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}

            //Show approval status 
            <div className="mt-2 text-sm text-gray-600">
              <p>Advisor: {f.advisorApproval.status}</p>
              <p>Admin: {f.adminApproval.status}</p>
              <p>HOD: {f.hodApproval.status}</p>
              <p>Dean: {f.deanApproval.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
*/