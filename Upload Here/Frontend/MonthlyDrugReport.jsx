import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MonthlyDrugReport() {
  const [lowStock, setLowStock] = useState([]);
  const reportRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/drugs/low-stock-report")
      .then((res) => res.json())
      .then((data) => setLowStock(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("LowStockDrugReport.pdf");
    });
  };

  const handleClick = () => {
    navigate("/drugs"); // Go back to the main drug page
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Side Panel */}
      <div className="w-1/4 bg-gradient-to-b from-blue-600 to-purple-600 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white"> Low Stock Drug Report</h1>
        </div>
        <div>
          <button
            onClick={handleClick}
            className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Low Stock Drug Report
        </h1>

        <button
          onClick={downloadPDF}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download PDF
        </button>

        <div ref={reportRef}>
          {lowStock.length === 0 ? (
            <p className="text-gray-600">No drugs below 100 units this month.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Drug Name</th>
                  <th className="px-6 py-3">Dosage</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Month</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((d) => (
                  <tr key={d._id} className="border-b">
                    <td className="px-6 py-4">{d.name}</td>
                    <td className="px-6 py-4">{d.dosage}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">{d.quantity}</td>
                    <td className="px-6 py-4">
                      {new Date(d.updatedAt).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
