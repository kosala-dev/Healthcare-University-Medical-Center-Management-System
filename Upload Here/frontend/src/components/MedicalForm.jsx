import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

export default function MedicalForm() {
  const printRef = useRef(null);
  const fileInputRef = useRef(null); // <-- NEW: ref for file input

  const initialSubjects = Array.from({ length: 10 }, () => ({
    subject: "",
    code: "",
    dateOfExam: "",
  }));

  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    registrationNo: "",
    field: "",
    faculty: "",       
    department: "",    
    examTitle: "",
    subjects: initialSubjects,
    reasonType: "medical",
    reason: "",
    studentRequest: "",
    firstAttempt: "",
    attachedARReceipt: false,
    attachedRegisteredLetter: false,
    medicalOfficerName: "",
    medicalOfficerTitle: "",
    slmcRegNo: "",
    otherDocs: null,
    signature: "",
  });

  const [myForms, setMyForms] = useState([]);

  // Fetch previous forms whenever registrationNo changes
  useEffect(() => {
    const fetchForms = async () => {
      if (!form.registrationNo) return;
      try {
        const res = await axios.get(
          `http://localhost:8080/api/getFormsByStudent/${form.registrationNo}`
        );
        setMyForms(res.data);
      } catch (err) {
        console.error("Error fetching forms:", err);
      }
    };
    fetchForms();
  }, [form.registrationNo]);

  // Handle input changes
  // only changes from your code are shown for file handling and FormData
const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  if (name.startsWith("subject_")) {
    const [, idx, key] = name.split("_");
    const newSubjects = [...form.subjects];
    newSubjects[idx][key] = value;
    setForm({ ...form, subjects: newSubjects });
    return;
  }

  if (type === "file") {
    if (files.length > 0) {
      setForm({ ...form, [name]: files[0] });
    }
    return;
  }

  if (type === "checkbox") {
    setForm({ ...form, [name]: checked });
    return;
  }

  setForm({ ...form, [name]: value });
};

const handleSubmit = async () => {
  try {
    if (!form.name || !form.examTitle || !form.registrationNo || !form.faculty || !form.department) {
      alert("Please fill Name, Registration No, Exam Title, Faculty, and Department");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "subjects") formData.append(key, JSON.stringify(form[key]));
      else if (form[key] instanceof File) formData.append(key, form[key]);
      else if (key === "otherDocs" && form[key]) formData.append(key, form[key]);
      else if (typeof form[key] === "boolean") formData.append(key, form[key] ? "true" : "false");
      else formData.append(key, form[key]);
    });

    // Store registrationNo temporarily
    const regNo = form.registrationNo;

    // Submit form
    await axios.post("http://localhost:8080/api/submitMedicalForm", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Form submitted successfully!");

    // Generate PDF
    if (printRef.current) {
      const element = printRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      pdf.save(`MedicalForm_${regNo}_${Date.now()}.pdf`);
    }

    // Refresh previous forms using temp regNo
    const formsRes = await axios.get(`http://localhost:8080/api/getFormsByStudent/${regNo}`);
    setMyForms(formsRes.data.forms || []);

    // Reset form
    setForm((prev) => ({
      ...prev,
      name: "",
      address: "",
      contact: "",
      field: "",
      faculty: "",
      department: "",
      examTitle: "",
      subjects: initialSubjects,
      reasonType: "medical",
      reason: "",
      studentRequest: "",
      firstAttempt: "",
      attachedARReceipt: false,
      attachedRegisteredLetter: false,
      medicalOfficerName: "",
      medicalOfficerTitle: "",
      slmcRegNo: "",
      signature: "",
      otherDocs: null,
      registrationNo: regNo, // keep registrationNo for next submission if needed
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";

  } catch (error) {
    console.error("Submit error:", error.response?.data || error);
    alert("Failed to submit form. Check console for details.");
  }
};




  return (
    <>
      <div className="w-full h-fit bg-gradient-to-tl from-blue-100 to-purple-100 mb-6">
        <Navbar />
      </div>

      <div ref={printRef} className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">University Of Vavuniya</h1>
          <h2 className="font-bold mb-4 text-center">
            Application for consideration of absence from end semester examinations on medical / justifiable humanitarian ground
          </h2>
          <h3 className="mb-6 text-center text-gray-700 text-sm">
            (Duly completed applications should be handed over to the SAR/AR of the respective faculty with relevant documents and medical certified by the University Medical Officer)
          </h3>

          <form className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <label className="block font-medium">1) Name of the candidate:</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
              </div>
              <div>
                <label className="block font-medium">2) Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium">3) Contact</label>
                  <input name="contact" value={form.contact} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
                </div>
                <div>
                  <label className="block font-medium">4) Registration No</label>
                  <input name="registrationNo" value={form.registrationNo} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
                </div>
                <div>
                  <label className="block font-medium">5) Field of specialization</label>
                  <input name="field" value={form.field} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
                </div>
            </div>
            {/* Faculty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Faculty
                </label>
                <select
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a Faculty</option>
                  <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                  <option value="Faculty of Business Studies">Faculty of Business Studies</option>
                  <option value="Faculty of Technological Studies">Faculty of Technological Studies</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a Department</option>
                  <option value="Department of Physical Science">Department of Physical Science</option>
                  <option value="Department of Bio Science">Department of Bio Science</option>
                  <option value="Business Economics">Business Economics</option>
                  <option value="English Language Teaching">English Language Teaching</option>
                  <option value="Finance and Accountancy">Finance and Accountancy</option>
                  <option value="Human Resource Management">Human Resource Management</option>
                  <option value="Management and Entrepreneurship">Management and Entrepreneurship</option>
                  <option value="Marketing Management">Marketing Management</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Department of ICT">Department of ICT</option>
                </select>
              </div>
            </div>
              <div>
                <label className="block font-medium">6) Title of Examination as mentioned in the Time Table</label>
                <input name="examTitle" value={form.examTitle} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
              </div>

              {/* Subjects */}
              <div>
                <label className="block font-medium mb-2">7) Details of course units (absent for the above exam)</label>
                {form.subjects.map((s, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-1">
                    <input name={`subject_${i}_subject`} value={s.subject} onChange={handleChange} placeholder="Subject" className="border-b px-1" />
                    <input name={`subject_${i}_code`} value={s.code} onChange={handleChange} placeholder="Code" className="border-b px-1" />
                    <input name={`subject_${i}_dateOfExam`} value={s.dateOfExam} onChange={handleChange} placeholder="Date" className="border-b px-1" />
                  </div>
                ))}
              </div>

              {/* Reason */}
              <div>
                <label className="block font-medium">8) Reason for absence</label>
                <div className="flex items-center gap-4 mb-2">
                  {["medical", "other"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="radio" name="reasonType" value={type} checked={form.reasonType === type} onChange={() => setForm({ ...form, reasonType: type })} />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
                <textarea name="reason" value={form.reason} onChange={handleChange} rows={2} className="w-full border px-2 py-1" />
              </div>

              {/* Documents */}
              <div className="mt-4">
                <label className="font-medium">Medical Certificate (Attach PDF)</label>
                <input
                  type="file"
                  name="otherDocs"
                  accept="application/pdf"
                  ref={fileInputRef} // <-- use ref here
                  onChange={handleChange}
                  className="block mt-2"
                />
                {form.otherDocs && <p className="text-sm text-gray-600 mt-1">Selected file: {form.otherDocs.name}</p>}
              </div>

              <h3 className="mt-4 font-medium">I confirm that the above facts are correct</h3>
              <input name="signature" value={form.signature} onChange={handleChange} placeholder="Signature of Student" className="w-full border-b px-2 py-1 mt-2" />
            </div>
          </form>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-center mt-6">
        <button onClick={handleSubmit} type="button" className="px-6 py-2 mr-10 rounded bg-blue-600 text-white font-semibold">
          Submit & Download
        </button>
      </div>

      {/* Previously submitted forms */}
      {myForms.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Previously Submitted Forms</h2>
          <ul className="space-y-2">
            {myForms.map((f) => (
              <li key={f._id} className="border-b py-2">
                <strong>Exam:</strong> {f.examTitle} | <strong>Submitted on:</strong>{" "}
                {new Date(f.createdAt).toLocaleString()} |{" "}
                <a
                  href={`http://localhost:8080/api/download/${f.otherDocs}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download PDF
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="footer px-5 sm:px-10 bg-[#670047] mt-8">
        <hr className="my-12 border-2 border-gray-300" />
        <Footer />
      </div>
    </>
  );
}
