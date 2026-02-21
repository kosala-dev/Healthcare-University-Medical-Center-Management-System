import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "../components/Footer";

export default function AddAppointment() {
  const [formData, setFormData] = useState({
    regnum: "",
    fullname: "",
    email: "",
    date: "",
    time: "",
    condition: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    const day = selectedDate.getDay(); 

    
    if (day === 0) {
      setMessage("Appointments are not available on Sundays.");
      return;
    }

   
    if (formData.time < "08:30" || formData.time > "16:00") {
      setMessage("Please select a time between 8:30 AM and 4:00 PM.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/Appointments/",
        formData
      );

      setMessage(res.data.message || "Appointment booked successfully!");

      setFormData({
        regnum: "",
        fullname: "",
        email: "",
        date: "",
        time: "",
        condition: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <>
      <div>
        <Navbar/>
      </div>

    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-20 mb-10">
      <h1 className="text-2xl font-bold text-center mb-4">
        Add Appointment
      </h1>

      <div className="mb-4 p-3 border border-blue-400 bg-blue-50 text-blue-800 rounded-md text-sm">
        <strong>Notice:</strong><br />
        Appointments are available <strong>Monday to Saturday</strong> only,
        between <strong>8:30 AM and 4:00 PM</strong>.
      </div>

      {message && (
        <p className="text-center text-green-600 mb-4">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="regnum"
          placeholder="Registration Number"
          value={formData.regnum}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          min="08:30"
          max="16:00"
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="text"
          name="condition"
          placeholder="Condition"
          value={formData.condition}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-[#670047] text-white py-2 rounded-lg"
        >
          Book Appointment
        </button>
      </form>
    </div>

        <div className="bg-[#670047]">
            <hr className="border-gray-400 opacity-20" />
            <div className="px-5 sm:px-10 py-8">
              <Footer />
            </div>
        </div> 
    </>
  );
}