import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function PatientDashboard({ regnum: regnumProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const regnum = regnumProp || location.state?.regnum;

  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [medicalHistories, setMedicalHistories] = useState([]);
  const [loadingHistories, setLoadingHistories] = useState(true);
  const [showMedicalHistories, setShowMedicalHistories] = useState(false);

  // ---------------------
  // Fetch patient details
  // ---------------------
  useEffect(() => {
    if (!regnum) return;

    setLoadingPatient(true);
    axios
      .get(`http://localhost:8080/patient/patientdetails/${regnum}`)
      .then((res) => {
        if (res.data.success) setPatient(res.data.patdet);
        else setPatient(null);
      })
      .catch((err) => {
        console.error("Error fetching patient details:", err);
        setPatient(null);
      })
      .finally(() => setLoadingPatient(false));
  }, [regnum]);

  // ---------------------
  // Fetch medical histories
  // ---------------------
  useEffect(() => {
    if (!regnum) return;

    setLoadingHistories(true);
    axios
      .get(`http://localhost:8080/medicalhis/medical-history-user/${regnum}`)
      .then((res) => setMedicalHistories(res.data || []))
      .catch((err) => console.error("Error fetching medical histories:", err))
      .finally(() => setLoadingHistories(false));
  }, [regnum]);

  // ---------------------
  // Navigation handlers
  // ---------------------
  const navigateChangePassword = () => navigate("/changepassword");

  const handleAppointmentClick = () => {
    if (!patient) return;
    navigate("/AddAppointment", {
      state: {
        regnum: patient.regnum,
        fullname: patient.fullname,
        email: patient.email,
      },
    });
  };

  const navigateMedicalForm = () => {
    if (!patient) return;
    navigate("/submit-medical", {
      state: {
        regnum: patient.regnum,
        fullname: patient.fullname,
        email: patient.email,
      },
    });
  };

  const goPatientForms = () => {
    if (!patient) return;
    navigate("/medicalFormsPatient", {
      state: { regnum: patient.regnum },
    });
  };

  const toggleMedicalHistories = () =>
    setShowMedicalHistories((prev) => !prev);

  // ---------------------
  // Render
  // ---------------------
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Back to home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {loadingPatient
              ? "Loading patient details..."
              : patient
              ? `Welcome ${patient.fullname}'s Dashboard`
              : "Patient not found"}
          </h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        {/* Patient Details */}
        {patient && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex space-x-8">
            <div className="flex-shrink-0 w-1/4">
              <img
                src={
                  patient.image
                    ? patient.image
                    : patient.gender === "Male"
                    ? "/images/default_male.png"
                    : patient.gender === "Female"
                    ? "/images/default_female.png"
                    : "/images/man.png"
                }
                alt="Patient"
                className="w-full h-85 object-cover rounded-lg border-4 border-blue-500"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-medium text-gray-800">
                Full Name: {patient.fullname}
              </h3>
              <h4 className="text-md text-gray-700">Address: {patient.address}</h4>
              <p className="text-md text-gray-700">City: {patient.city}</p>
              <p className="text-md text-gray-700">Course: {patient.course}</p>
              <p className="text-md text-gray-700">Department: {patient.department}</p>
              <p className="text-md text-gray-700">Faculty: {patient.faculty}</p>
              <p className="text-md text-gray-700">Blood Group: {patient.bloodgroup}</p>
              <p className="text-md text-gray-700">Gender: {patient.gender}</p>
              <p className="text-md text-gray-700">
                Account Created At: {patient.createdAt}
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        {patient && (
          <div className="flex space-x-4 mb-6">
            <button
              onClick={toggleMedicalHistories}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {showMedicalHistories
                ? "Hide Medical Histories"
                : "View Medical Histories"}
            </button>
            <button
              onClick={navigateChangePassword}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Change Password
            </button>
            <button
              onClick={handleAppointmentClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Appointment
            </button>
            <button
              onClick={navigateMedicalForm}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit / Download Medical Form
            </button>
            <button
              onClick={goPatientForms}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Check Approval
            </button>
          </div>
        )}

        {/* Medical Histories Table */}
        {showMedicalHistories && (
          <>
            {loadingHistories ? (
              <p className="text-gray-600">Loading medical histories...</p>
            ) : medicalHistories.length === 0 ? (
              <p className="text-gray-600">No medical histories found.</p>
            ) : (
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-teal-500 text-white">
                    <th className="px-6 py-3 text-left text-sm">Blood Pressure</th>
                    <th className="px-6 py-3 text-left text-sm">Blood Sugar</th>
                    <th className="px-6 py-3 text-left text-sm">Weight</th>
                    <th className="px-6 py-3 text-left text-sm">Temperature</th>
                    <th className="px-6 py-3 text-left text-sm">Symptoms</th>
                    <th className="px-6 py-3 text-left text-sm">Diagnosis</th>
                    <th className="px-6 py-3 text-left text-sm">Visit Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalHistories.map((h, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{h.bloodPressure}</td>
                      <td className="px-6 py-4 text-sm">{h.bloodSugar}</td>
                      <td className="px-6 py-4 text-sm">{h.weight}</td>
                      <td className="px-6 py-4 text-sm">{h.temperature}</td>
                      <td className="px-6 py-4 text-sm">{h.symptoms}</td>
                      <td className="px-6 py-4 text-sm">{h.diagnosis}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(h.visitDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
