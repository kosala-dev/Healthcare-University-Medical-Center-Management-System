import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminDetails() {
  const [admin, setAdmin] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/getadmindetails")
      .then((res) => {
        setAdmin(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDeleteAdmin = async (username) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/auth/${username}`
      );

      if (response.status === 200) {
        alert("Admin deleted successfully.");
        setAdmin((prev) => prev.filter((item) => item.username !== username));
      } else {
        alert("Failed to delete the admin. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("An error occurred while deleting the admin.");
    }
  };

  const goUpdateAdmin = (item) => {
    navigate("/updateadmin", { state: item });
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Details
        </h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gradient-to-r from-[#4A0033] to-[#670047]">
              <tr>
                <th className="px-4 py-3 text-white font-semibold text-center uppercase text-sm">
                  Username
                </th>
                <th className="px-4 py-3 text-white font-semibold text-center uppercase text-sm">
                  Gender
                </th>
                <th className="px-4 py-3 text-white font-semibold text-center uppercase text-sm">
                  Faculty
                </th>
                <th className="px-4 py-3 text-white font-semibold text-center uppercase text-sm">
                  Department
                </th>
                <th className="px-4 py-3 text-white font-semibold text-center uppercase text-sm">
                  Type
                </th>
                <th className="px-4 py-3 text-white font-semibold text-center uppercase text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admin.map((item, key) => (
                <tr key={key} className="hover:bg-gray-50 transition-colors">
                  <td className="border-r border-gray-200 px-4 py-3 text-gray-700">
                    {item.username}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-center text-gray-700">
                    {item.gender}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-gray-700">
                    {item.faculty || "N/A"}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-gray-700">
                    {item.department || "N/A"}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-3 text-center">
                      {item.admintype}
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-center items-center">
                    <button
                      className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                      onClick={() => goUpdateAdmin(item)}
                    >
                      Update
                    </button>
                    <button
                      className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      onClick={() => handleDeleteAdmin(item.username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="footer px-5 sm:px-10 bg-[#670047]">
        <hr className="my-8 border border-gray-300 opacity-30" />
        <Footer />
      </div>
    </>
  );
}