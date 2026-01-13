import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Medical Forms</h1>
      {forms.length === 0 && <p>No forms submitted yet.</p>}

      <div className="space-y-4">
        {forms.map((f) => (
          <div key={f._id} className="border p-4 rounded-lg shadow-sm bg-white">
            <p><strong>Exam:</strong> {f.examTitle}</p>
            <p><strong>Subjects:</strong> {f.subjects.map(s => s.subject).join(", ")}</p>
            <p><strong>Status:</strong></p>
            <ul className="ml-4 text-gray-600">
              <li>Advisor: {f.advisorApproval.status}</li>
              <li>Admin: {f.adminApproval.status}</li>
              <li>HOD: {f.hodApproval.status}</li>
              <li>Dean: {f.deanApproval.status}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
