import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function MedicalFormsDean() {
  const location = useLocation();
  const username = localStorage.getItem("username");
  const faculty = localStorage.getItem("faculty");

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dean sees only forms approved by HOD
  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/approvalForms/dean/${faculty}/any`
      );
      console.log("Fetched Dean forms:", res.data.forms);
      setForms(res.data.forms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [faculty]);

  const handleApproval = async (formId, action) => {
    try {
      await axios.post(`http://localhost:8080/api/approveForm/dean/${formId}`, {
        status: action,
        username,
      });

      // Update local status only
      setForms((prev) =>
        prev.map((f) =>
          f._id === formId
            ? { ...f, deanApproval: { ...f.deanApproval, status: action } }
            : f
        )
      );
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dean Approval</h1>

      {loading ? (
        <p>Loading forms...</p>
      ) : forms.length === 0 ? (
        <p>No forms pending approval.</p>
      ) : (
        <div className="space-y-4">
          {forms.map((f) => (
            <div key={f._id} className="border p-4 rounded-lg shadow-sm bg-white">
              <p><strong>Student:</strong> {f.name}</p>
              <p><strong>Registration No:</strong> {f.registrationNo}</p>
              <p><strong>Faculty:</strong> {f.faculty}</p>
              <p><strong>Exam:</strong> {f.examTitle}</p>

              <p><strong>Subjects:</strong></p>
              <ul className="ml-4 list-disc">
                {f.subjects
                  .filter((s) => s.subject || s.code || s.dateOfExam) // only filled
                  .map((s, idx) => (
                    <li key={idx}>
                      <strong>{s.subject}</strong>
                      {s.code ? ` - ${s.code}` : ""}
                      {s.dateOfExam ? ` (${s.dateOfExam})` : ""}
                    </li>
                  ))}
              </ul>

              <p><strong>Reason:</strong> {f.reason}</p>

              {/* Downloadable document */}
              {f.otherDocs && (
                <p>
                  <strong>Document:</strong>{" "}
                  <a
                    href={`http://localhost:8080/api/download/${f.otherDocs}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download PDF
                  </a>
                </p>
              )}

              {/* Approve / Reject buttons */}
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

              {/* Approval status */}
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p><strong>Advisor:</strong> {f.advisorApproval.status}</p>
                <p><strong>Admin:</strong> {f.adminApproval.status}</p>
                <p><strong>HOD:</strong> {f.hodApproval.status}</p>
                <p><strong>Dean:</strong> {f.deanApproval.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
