import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Message() {
  const navigate = useNavigate();

  const [regnum, setRegnum] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobnum, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [faculty, setFaculty] = useState("");
  const [course, setCourse] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setErrMessage("");

    try {
      const response = await axios.post("http://localhost:8080/message/sendmsg", {
        regnum,
        name,
        email,
        mobnum,
        message,
        faculty,
        course,
      });

      if (response) {
        console.log("Success Send Message");
      }
      setResponseMessage("✅ Message sent successfully.");
      setRegnum("");
      setName("");
      setEmail("");
      setMobile("");
      setMessage("");
      setFaculty("");
      setCourse("");
    } catch (err) {
      setErrMessage("❌ Error sending the message. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
    <div>
      <Navbar/>
    </div> <br/>


    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-8 lg:px-20">

      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-8 text-center">
        Message Center
      </h1>

      <div className="w-full max-w-3xl bg-white shadow-md rounded-3xl py-10 px-6 sm:px-10 lg:px-16">

        <form onSubmit={handlesubmit}>
          <div className="flex flex-wrap justify-between mb-6 gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Registration Number
              </label>
              <input
                className="w-full h-10 rounded-lg px-4 border border-gray-400"
                type="text"
                value={regnum}
                placeholder="Enter your registration number"
                onChange={(e) => setRegnum(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                className="w-full h-10 rounded-lg px-4 border border-gray-400"
                type="text"
                value={name}
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-between mb-6 gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Faculty
              </label>
              <select
                className="w-full h-10 bg-zinc-100 rounded-lg px-4 focus:ring-2 focus:ring-blue-500"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              >
                <option value="" disabled hidden>-- Select your faculty --</option>
                <option value="Faculty of Applied Science">Faculty of Applied Science</option>
                <option value="Faculty of Business Studies">Faculty of Business Studies</option>
                <option value="Faculty of Technological Studies">Faculty of Technological Studies</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Course
              </label>
              <input
                className="w-full h-10 rounded-lg px-4 border border-gray-400"
                type="text"
                value={course}
                placeholder="Enter your course"
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-between mb-6 gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                className="w-full h-10 rounded-lg px-4 border border-gray-400"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Mobile Number
              </label>
              <input
                className="w-full h-10 rounded-lg px-4 border border-gray-400"
                type="text"
                value={mobnum}
                placeholder="Enter your mobile number"
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              className="w-full h-40 rounded-lg px-4 border border-gray-400"
              rows={8}
              value={message}
              placeholder="Type your message here..."
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-10 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Send Message
            </button>
          </div>
        </form>

        {responseMessage && (
          <p className="mt-6 text-center text-green-600 font-medium">
            {responseMessage}
          </p>
        )}
        {errMessage && (
          <p className="mt-6 text-center text-red-600 font-medium">
            {errMessage}
          </p>
        )}
      </div>
    </div>

    <div className="footer px-5 sm:px-10 bg-[#670047] mt-8">
        <hr className="my-12 border-2 border-gray-300" />
        <Footer />
    </div>
    </>
  );
}
