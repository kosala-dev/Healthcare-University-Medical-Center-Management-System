import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../components/Footer";


export default function RegisterStudent() {
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
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const tologin = () => {
    navigate("/login");
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Upload image
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await axios.post(
        "http://localhost:8080/patient/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // If image upload is successful, get the file path
      const imagePath = uploadRes.data.filePath;

      // Register patient
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
          image: imagePath,
        }
      );

      if (res.data.registered) {
        setSuccessMessage(res.data.message);
        setErrorMessage("");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Navbar Section */}
      <div>
        <Navbar/>
      </div>

        {/* Main Content */}
        <div className="w-3/4 p-8">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Register Patient
            </h1>
            <hr className="mt-2 border-t-2 border-gray-200" />
          </div>

          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {successMessage && (
              <div className="mb-6 text-green-600 text-center text-lg">
                {successMessage}
              </div>
            )}
            <form
              onSubmit={handlesubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Registration Number */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 2020ICT01"
                  value={regnum}
                  onChange={(e) => setRegnum(e.target.value)}
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: A.B.C Perera"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 123/5 ABC Mawatha, Colombo"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Colombo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Course
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: IT/BS/BTEC IT/AMC/CS/ENS"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Department
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Physical Science/Biological Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Faculty
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Applied Science/Business Studies/Technology"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  required
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Blood Group
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: B-/B+"
                  value={bloodgroup}
                  onChange={(e) => setBlood(e.target.value)}
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Gender
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Profile Photo */}
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Select Profile Photo
                </label>
                <input
                  type="file"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="col-span-2 text-red-500 text-sm text-center">
                  {errorMessage}
                </div>
              )}

              {/* Register Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  Register
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <button
                onClick={tologin}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        </div>
        
      {/* Footer */}
        <div className="bg-[#670047]">
            <hr className="border-gray-400 opacity-20" />
            <div className="px-5 sm:px-10 py-8">
              <Footer />
            </div>
        </div> 
    </>
  );
}
