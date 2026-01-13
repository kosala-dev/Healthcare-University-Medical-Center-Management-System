import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MedicalFormsAdvisor() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const faculty = localStorage.getItem("faculty");
  const department = localStorage.getItem("department");

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username || !faculty || !department) {
      alert("Session expired. Please login again.");
      navigate("/advisorDashboard");
      return;
    }

    const fetchForms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/approvalForms/advisor/${faculty}/${department}`
        );
        console.log("Fetched forms:", res.data.forms);
        setForms(res.data.forms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [username, faculty, department, navigate]);

  const handleApproval = async (formId, action) => {
    try {
      await axios.post(`http://localhost:8080/api/approveForm/advisor/${formId}`, {
        status: action,
        username,
      });

      setForms((prev) =>
        prev.map((f) =>
          f._id === formId
            ? { ...f, advisorApproval: { ...f.advisorApproval, status: action } }
            : f
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Academic Advisor Approval</h1>

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
              <p><strong>Department:</strong> {f.department}</p>
              <p><strong>Exam:</strong> {f.examTitle}</p>
              <p>
                <strong>Subjects:</strong>{" "}
                {f.subjects
                .filter((s) => s.subject || s.code || s.dateOfExam) // only non-empty
                .map((s, idx) => (
                <div key={idx}>
                    <strong>{s.subject}</strong> - {s.code} ({s.dateOfExam})
                </div>
                ))}
              </p>
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

              {/* Approval status table */}
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
