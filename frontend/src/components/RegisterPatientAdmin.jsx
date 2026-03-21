import {React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <div>
        <Navbar/>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full md:w-3/4 lg:w-2/3 max-w-4xl">
          
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
              Register Patient
            </h1>
            <hr className="mt-3 border-t-2 border-gray-200" />
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
            {successMessage && (
              <div className="mb-6 text-green-700 text-center text-sm font-semibold bg-green-50 p-4 rounded-lg border border-green-200">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 text-red-600 text-center text-sm font-semibold bg-red-50 p-4 rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handlesubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                { label: "Registration Number", value: regnum, setter: setRegnum, placeholder: "Ex: 2021ICT36" },
                { label: "Full Name", value: fullname, setter: setFullName, placeholder: "Ex: A.B.C Perera" },
                { label: "Email", value: email, setter: setEmail, placeholder: "Ex: 20XX@stu.vau.ac.lk", type: "email" },
                { label: "Address", value: address, setter: setAddress, placeholder: "123/5 ABC Mawatha, Colombo" },
                { label: "City", value: city, setter: setCity, placeholder: "Ex: Colombo" },
                { label: "Course", value: course, setter: setCourse, placeholder: "Ex: IT/BS/BTEC IT/AMC/CS/ENS" },
                { label: "Password", value: password, setter: setPassword, placeholder: "Enter password", type: "password" },
                { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, placeholder: "Confirm password", type: "password" },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  />
                </div>
              ))}

              {[
                { label: "Department", value: department, setter: setDepartment, options: [
                  "Department of Physical Science", "Department of Bio Science", "Business Economics",
                  "English Language Teaching", "Finance and Accountancy", "Human Resource Management",
                  "Management and Entrepreneurship", "Marketing Management", "Project Management", "Department of ICT"
                ] },
                { label: "Faculty", value: faculty, setter: setFaculty, options: [
                  "Faculty of Applied Science", "Faculty of Business Studies", "Faculty of Technological Studies"
                ] },
                { label: "Blood Group", value: bloodgroup, setter: setBlood, options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
                { label: "Gender", value: gender, setter: setGender, options: ["Male", "Female", "Other"] },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {field.label}
                  </label>
                  <select
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition duration-200"
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

              <div className="col-span-1 md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-lg shadow-md"
                >
                  Register
                </button>
              </div>
            </form>
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
