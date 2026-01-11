import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterStudentadmin() {
  const [regnum, setRegnum] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [bloodgroup, setBlood] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (
      !regnum ||
      !fullname ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender ||
      !address ||
      !city ||
      !course ||
      !department ||
      !faculty ||
      !bloodgroup
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/patient/patientregister",
        {
          regnum,
          fullname,
          email,
          address,
          city,
          course,
          department,
          faculty,
          bloodgroup,
          gender,
          password,
        }
      );

      if (res.data.registered) {
        setSuccessMessage(res.data.message);
        setErrorMessage("");
        setTimeout(() => {
          navigate("/registerpatientadmin");
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleClick = () => {
    const role = sessionStorage.getItem("role");

    if (role === "admin") {
      navigate("/admindashboard");
    } else if (role === "superadmin") {
      navigate("/superadmindashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Medical Center University of Vavuniya
          </h1>
          <p className="text-sm text-white mt-2">
            Secure and Reliable Healthcare Services
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleClick}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Back to dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Register Patient</h1>
          <hr className="mt-2 border-t-2 border-gray-200" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {successMessage && (
            <div className="mb-4 text-green-600 text-center text-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-red-600 text-center text-lg">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handlesubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Text Inputs */}
            {[
              { label: "Registration Number", value: regnum, setter: setRegnum, placeholder: "Ex: 2020ICT01" },
              { label: "Full Name", value: fullname, setter: setFullName, placeholder: "Ex: A.B.C Perera" },
              { label: "Email", value: email, setter: setEmail, placeholder: "user@gmail.com", type: "email" },
              { label: "Address", value: address, setter: setAddress, placeholder: "123/5 ABC Mawatha, Colombo" },
              { label: "City", value: city, setter: setCity, placeholder: "Ex: Colombo" },
              { label: "Course", value: course, setter: setCourse, placeholder: "Ex: IT/BS/BTEC IT/AMC/CS/ENS" },
              { label: "Password", value: password, setter: setPassword, placeholder: "Enter password", type: "password" },
              { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, placeholder: "Confirm password", type: "password" },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Select Inputs */}
            {[
              { label: "Department", value: department, setter: setDepartment, options: [
                "Department of Physical Science",
                "Department of Bio Science",
                "Business Economics",
                "English Language Teaching",
                "Finance and Accountancy",
                "Human Resource Management",
                "Management and Entrepreneurship",
                "Marketing Management",
                "Project Management",
                "Department of ICT",
              ] },
              { label: "Faculty", value: faculty, setter: setFaculty, options: [
                "Faculty of Applied Science",
                "Faculty of Business Studies",
                "Faculty of Technological Studies",
              ] },
              { label: "Blood Group", value: bloodgroup, setter: setBlood, options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
              { label: "Gender", value: gender, setter: setGender, options: ["Male", "Female", "Other"] },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  {field.label}
                </label>
                <select
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
