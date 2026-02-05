import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function MedicalForm() {
  const printRef = useRef(null);
  const fileInputRef = useRef(null);
  const historySectionRef = useRef(null);
  const location = useLocation();

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
    agreeToDeclaration: false,
  });

  const [myForms, setMyForms] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      const stateRegNum = location.state?.regnum;
      const stateFullName = location.state?.fullname;
      
      let currentRegNum = stateRegNum || localStorage.getItem("registrationNo");

      if (currentRegNum) {
        setForm((prev) => ({ 
          ...prev, 
          registrationNo: currentRegNum,
          name: stateFullName || prev.name 
        }));
        
        await fetchPatientDetails(currentRegNum);
        await fetchHistory(currentRegNum);
      }
    };

    initializePage();
  }, [location.state]);

  const fetchPatientDetails = async (regnum) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/patient/patientdetails/${regnum}`
      );
      
      if (response.data.success) {
        const details = response.data.patdet;
        
        setForm((prev) => ({
          ...prev,
          name: details.fullname || prev.name || "", 
          address: details.address || "",
          contact: details.mobile || details.contact || "", 
          registrationNo: details.regnum || regnum,
          faculty: details.faculty || "",
          department: details.department || "",
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistory = async (regNo) => {
    if (!regNo) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/getFormsByStudent/${regNo}`
      );
      const forms = res.data.forms || res.data || [];
      if (Array.isArray(forms)) {
        setMyForms(forms);
        if (forms.length > 0) setShowHistory(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScrollToHistory = () => {
      setShowHistory(true);
      setTimeout(() => {
        historySectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      fetchHistory(form.registrationNo);
  };

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
      if (files.length > 0) setForm({ ...form, [name]: files[0] });
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

      if (!form.agreeToDeclaration) {
        alert("You must tick the declaration box to sign and submit the form.");
        return;
      }

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "subjects") formData.append(key, JSON.stringify(form[key]));
        else if (key === "agreeToDeclaration") { }
        else if (key === "signature") formData.append(key, form.name);
        else if (form[key] instanceof File) formData.append(key, form[key]);
        else if (key === "otherDocs" && form[key]) formData.append(key, form[key]);
        else if (typeof form[key] === "boolean") formData.append(key, form[key] ? "true" : "false");
        else formData.append(key, form[key]);
      });

      if (!formData.has("signature")) formData.append("signature", form.name);
      
      const regNo = form.registrationNo;

      await axios.post("http://localhost:8080/api/submitMedicalForm", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Form submitted successfully!");

      if (printRef.current) {
        const element = printRef.current;
        const originalFont = element.style.fontFamily;
        element.style.fontFamily = "Arial, sans-serif";

        const selects = element.querySelectorAll("select");
        const originalStyles = [];
        selects.forEach((select, index) => {
          originalStyles[index] = { ...select.style };
          select.style.appearance = "none";
          select.style.webkitAppearance = "none";
          select.style.background = "transparent";
          select.style.paddingTop = "8px"; 
          select.style.paddingBottom = "8px"; 
        });

        const opt = {
          margin: 0.5,
          filename: `MedicalForm_${regNo}_${Date.now()}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true, dpi: 300 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        await html2pdf().set(opt).from(element).save();

        element.style.fontFamily = originalFont;
        selects.forEach((select, index) => {
          Object.assign(select.style, originalStyles[index]);
        });
      }

      fetchHistory(regNo);

      setForm((prev) => ({
        ...prev,
        field: "", faculty: "", department: "", examTitle: "",
        subjects: initialSubjects, reasonType: "medical", reason: "", studentRequest: "",
        firstAttempt: "", attachedARReceipt: false, attachedRegisteredLetter: false,
        medicalOfficerName: "", medicalOfficerTitle: "", slmcRegNo: "", otherDocs: null,
        agreeToDeclaration: false, 
      }));

      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error(error);
      alert("Failed to submit form. Check console for details.");
    }
  };

  return (
    <>
      <div className="w-full h-fit bg-gradient-to-tl from-blue-100 to-purple-100 mb-6">
        <Navbar />
      </div>

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div id="pdf-content" ref={printRef} className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">University Of Vavuniya</h1>
          <h2 className="font-bold mb-4 text-center text-sm md:text-base">
            Application for consideration of absence from end semester examinations on medical / justifiable humanitarian ground
          </h2>
          <h3 className="mb-6 text-center text-gray-700 text-xs md:text-sm">
            (Duly completed applications should be handed over to the SAR/AR of the respective faculty with relevant documents and medical certified by the University Medical Officer)
          </h3>

          <form className="space-y-6">
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
                  <input 
                    name="registrationNo" 
                    value={form.registrationNo} 
                    readOnly 
                    className="w-full border-b px-2 py-1 mt-2 bg-gray-50 text-gray-600 cursor-not-allowed" 
                    placeholder="Fetching ID..."
                  />
                </div>

                <div>
                  <label className="block font-medium">5) Field of specialization</label>
                  <input name="field" value={form.field} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Faculty</label>
                  <select name="faculty" value={form.faculty} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white" required>
                    <option value="">Select a Faculty</option>
                    <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                    <option value="Faculty of Business Studies">Faculty of Business Studies</option>
                    <option value="Faculty of Technological Studies">Faculty of Technological Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Department</label>
                  <select name="department" value={form.department} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white" required>
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium">6) Title of Examination as mentioned in the Time Table</label>
                <input name="examTitle" value={form.examTitle} onChange={handleChange} className="w-full border-b px-2 py-1 mt-2" />
              </div>

              <div>
                <label className="block font-medium mb-2">7) Details of course units (absent for the above exam)</label>
                {form.subjects.map((s, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 pb-2 border-b sm:border-none">
                    <input name={`subject_${i}_subject`} value={s.subject} onChange={handleChange} placeholder="Subject" className="border-b px-1 w-full" />
                    <input name={`subject_${i}_code`} value={s.code} onChange={handleChange} placeholder="Course Code" className="border-b px-1 w-full" />
                    <input name={`subject_${i}_dateOfExam`} value={s.dateOfExam} onChange={handleChange} placeholder="Date(D/M/Y)" className="border-b px-1 w-full" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-medium">8) Reason for absence</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  {["medical", "other"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="radio" name="reasonType" value={type} checked={form.reasonType === type} onChange={() => setForm({ ...form, reasonType: type })} />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
                <textarea name="reason" value={form.reason} onChange={handleChange} rows={2} className="w-full border px-2 py-1" />
              </div>

              <div className="mt-4">
                <label className="font-medium">Medical Certificate (Attach PDF)</label>
                <input type="file" name="otherDocs" accept="application/pdf" ref={fileInputRef} onChange={handleChange} className="block mt-2 w-full text-sm" />
                {form.otherDocs && <p className="text-sm text-gray-600 mt-1">Selected file: {form.otherDocs.name}</p>}
              </div>

              <div className="mt-8 border-t pt-4">
                 <h3 className="font-bold text-lg mb-2">Declaration</h3>
                 <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                    <input
                      type="checkbox"
                      name="agreeToDeclaration"
                      checked={form.agreeToDeclaration}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 shrink-0"
                    />
                    <div className="text-gray-800 text-sm leading-relaxed">
                      <span className="font-semibold block mb-1">I confirm that the above facts are correct.</span>
                      By ticking this box, I hereby declare that the information provided is true and accurate. 
                      I acknowledge that this digital confirmation serves as my signature for this application.
                    </div>
                 </label>
              </div>

            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mt-6 px-4">
        <button 
            onClick={handleSubmit} 
            type="button" 
            className={`w-full max-w-sm px-6 py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all ${
                form.agreeToDeclaration 
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Submit & Download Form
        </button>

        <button 
            onClick={handleScrollToHistory}
            type="button" 
            className="w-full max-w-sm px-6 py-2.5 rounded-lg border-2 border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Check Previous Submissions
        </button>
      </div>

      <div ref={historySectionRef} className="w-full max-w-4xl mx-auto mt-10 mb-16 px-4">
        {showHistory && (
            myForms.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    Submission History
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {myForms.map((f) => (
                    <div key={f._id} className="p-4 hover:bg-blue-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{f.examTitle || "Medical Submission"}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted on: {new Date(f.createdAt).toLocaleDateString()} at {new Date(f.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <a 
                        href={`http://localhost:8080/api/download/${f.otherDocs}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download PDF
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No previous medical submissions found for {form.registrationNo}</p>
              </div>
            )
        )}
      </div>

      <div className="footer px-5 sm:px-10 bg-[#670047] mt-8">
        <hr className="my-12 border-2 border-gray-300" />
        <Footer />
      </div>
    </>
  );
}