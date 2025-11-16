import { useState } from "react";
import axios from "axios";

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
    try {
      const res = await axios.post("http://localhost:8080/Appointments/", formData);
      setMessage(res.data.message);
      setFormData({
        regnum: "",
        fullname: "",
        email: "",
        date: "",
        time: "",
        condition: "",
      });
    } catch (err) {
      console.error("Error booking appointment:", err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Add Appointment</h1>

      {message && <p className="text-center text-red-600 mb-4">{message}</p>}

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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}
