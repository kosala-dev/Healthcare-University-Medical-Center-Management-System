import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MedicalForm() {

  const printRef = React.useRef(null);

  const handleDownloadPdf = async () => {
  const element = printRef.current;
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const data = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(data, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(data, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save('OnlineMedicalForm.pdf');
};


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
    otherDocs: "",
    signature: "",
    advisorRecommendation: "",
    officeNotes: "",
    officeDecision: "",
    officeSignature: "",
    officeDate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("subject_")) {
      const [_, idx, key] = name.split("_");
      const newSubjects = [...form.subjects];
      newSubjects[idx][key] = value;
      setForm({ ...form, subjects: newSubjects });
      return;
    }

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <>
      <div className="w-full h-fit bg-gradient-to-tl from-blue-100 to-purple-100 mb-6">
        <Navbar />
      </div>

      <div ref = {printRef} className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">University Of Vavuniya</h1>
          <h1 className=" font-bold mb-4 text-center">
            Application for consideration of absence from end semester examinations on medical / justifiable humanitarian ground
          </h1>
          <h3 className="mb-6 text-center text-gray-700 text-sm">
            (Duly completed applications should be handed over to the SAR/AR of the respective faculty with relevant documents and medical certified by the University Medical Officer)
          </h3>

          <form className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <label className="block font-medium">
                  1) Name of the candidate (with initials): Mr./Ms.
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border-b px-2 py-1 mt-2 block mt-2 block"
                />
              </div>

              <div>
                <label className="block font-medium">2) Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border-b px-2 py-1 mt-2 block"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium">3) Contact</label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    className="w-full border-b px-2 py-1 mt-2 block"
                  />
                </div>

                <div>
                  <label className="block font-medium">4) Registration No</label>
                  <input
                    name="registrationNo"
                    value={form.registrationNo}
                    onChange={handleChange}
                    className="w-full border-b px-2 py-1 mt-2 block"
                  />
                </div>

                <div>
                  <label className="block font-medium">5) Field of specialization</label>
                  <input
                    name="field"
                    value={form.field}
                    onChange={handleChange}
                    className="w-full border-b px-2 py-1 mt-2 block"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium">
                  6) Title of Examination as mentioned in the Time Table
                </label>
                <input
                  name="examTitle"
                  value={form.examTitle}
                  onChange={handleChange}
                  className="w-full border-b px-2 py-1 mt-2 block"
                />
              </div>

              {/* Subjects */}
              <div>
                <label className="block font-medium mb-2">
                  7) Details of course units (absent for the above exam)
                </label>
                {form.subjects.map((s, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-1">
                    <input
                      name={`subject_${i}_subject`}
                      value={s.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className="border-b px-1"
                    />
                    <input
                      name={`subject_${i}_code`}
                      value={s.code}
                      onChange={handleChange}
                      placeholder="Code"
                      className="border-b px-1"
                    />
                    <input
                      name={`subject_${i}_dateOfExam`}
                      value={s.dateOfExam}
                      onChange={handleChange}
                      placeholder="Date"
                      className="border-b px-1"
                    />
                  </div>
                ))}
              </div>

              {/* Reason */}
              <div>
                <label className="block font-medium">8) Reason for absence</label>
                <div className="flex items-center gap-4 mb-2">
                  {["medical", "other"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="reasonType"
                        value={type}
                        checked={form.reasonType === type}
                        onChange={() => setForm({ ...form, reasonType: type })}
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border px-2 py-1"
                />
              </div>

              {/* Student request & first attempt */}
              <div>
                <label className="block font-medium">9) Request by the student</label>
                <textarea
                  name="studentRequest"
                  value={form.studentRequest}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border-b px-2 py-1 mt-2 block"
                />
              </div>

              <div>
                <label className="block font-medium">
                  10) First attempt details Yes/No, if not give details
                </label>
                <textarea
                  name="firstAttempt"
                  value={form.firstAttempt}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border-b px-2 py-1 mt-2 block"
                />
              </div>

              {/* Documents & signature */}
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="attachedARReceipt"
                    checked={form.attachedARReceipt}
                    onChange={handleChange}
                  />
                  Copy of Receipt of telegram attached
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="attachedRegisteredLetter"
                    checked={form.attachedRegisteredLetter}
                    onChange={handleChange}
                  />
                  Registered Letter attached
                </label>
              </div>

              <label className="block font-medium">
                  Medical Officer Name
              </label>
              <input
                name="medicalOfficerName"
                value={form.medicalOfficerName}
                onChange={handleChange}
                className="w-full border-b px-2 py-1 mt-2 block mt-2"
              />

              <label className="block font-medium">
                  Medical Officer Title
              </label>
              <input
                name="medicalOfficerTitle"
                value={form.medicalOfficerTitle}
                onChange={handleChange}
                className="w-full border-b px-2 py-1 mt-2 block mt-1"
              />

              <label className="block font-medium">
                  SLMC Reg No
              </label>
              <input
                name="slmcRegNo"
                value={form.slmcRegNo}
                onChange={handleChange}
                className="w-full border-b px-2 py-1 mt-2 block mt-1"
              />

              <label className="block font-medium">
                  Other documents
              </label>
              <input
                name="otherDocs"
                value={form.otherDocs}
                onChange={handleChange}
                className="w-full border-b px-2 py-1 mt-2 block mt-1"
              />
              
              <br></br>
              <h3 className="mt-4 font-medium">I confirm that the above facts are correct</h3>
              <input
                name="signature"
                value={form.signature}
                onChange={handleChange}
                placeholder="Signature of Student"
                className="w-full border-b px-2 py-1 mt-2 block mt-1"
              />

              <h3 className="mt-4">
                Recommendation of Academic Advisor (Recommended/Not Recommended/Forwarded)
              </h3>
              <textarea
                name="advisorRecommendation"
                value={form.advisorRecommendation}
                onChange={handleChange}
                placeholder="Advisor Recommendation / Signature"
                className="w-full border-b px-2 py-1 mt-2 block"
              />

              {/* Office Use Only */}
              <h3 className="mt-6 font-medium">FOR OFFICE USE ONLY</h3>
              
              <textarea
                name="officeNotes"
                value={form.officeNotes}
                onChange={handleChange}
                rows={3}
                className="w-full border-b px-2 py-1 mt-2 block"
              />

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block font-medium mb-1">Decision</label>
                    <input
                      name="officeDecision"
                      value={form.officeDecision}
                      onChange={handleChange}
                      className="w-full border-b px-2 py-1 block"
                    />
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label className="block font-medium mb-1">Signature</label>
                    <input
                      name="officeSignature"
                      value={form.officeSignature}
                      onChange={handleChange}
                      className="w-full border-b px-2 py-1 block"
                    />
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label className="block font-medium mb-1">Date</label>
                    <input
                      name="officeDate"
                      value={form.officeDate}
                      onChange={handleChange}
                      className="w-full border-b px-2 py-1 block"
                    />
                  </div>
                </div>

            </div>
          </form>
        </div>
      </div>

      {/* Submit button placeholder (no action) */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleDownloadPdf}
          type="button"
          className="px-6 py-2 mr-10 rounded bg-blue-600 text-white font-semibold"
        >
          Submit & Download
        </button>
      </div>

      <div className="footer px-5 sm:px-10 bg-[#670047] mt-8">
        <hr className="my-12 border-2 border-gray-300" />
        <Footer />
      </div>
    </>
  );
}
