import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MonthlyDrugReport() {
  const [lowStock, setLowStock] = useState([]);
  const reportRef = useRef();
  const navigate = useNavigate();

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetch("http://localhost:8080/drugs/low-stock-report")
      .then((res) => res.json())
      .then((data) => setLowStock(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const downloadPDF = () => {
    const input = reportRef.current;
    
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Clean A4 Layout
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LowStockReport_${currentMonth.replace(" ", "_")}.pdf`);
    });
  };

  const handleClick = () => {
    navigate("/drugs");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* Side Panel */}
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 flex flex-col justify-between shadow-lg">
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Medical Center Reports
          </h1>
          <p className="text-white/80 mt-2 text-sm">Monthly Inventory Analysis</p>
        </div>
        <div>
          <button
            onClick={handleClick}
            className="w-full bg-white text-[#670047] py-3 px-4 rounded-lg font-bold shadow-md hover:bg-gray-100 transition-colors"
          >
            ← Back to Inventory
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center">
        
        {/* Action Bar */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Report Preview</h2>
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md font-medium transition-all flex items-center gap-2"
          >
            <span>📥</span> Download PDF
          </button>
        </div>

        {/* --- UI WRAPPER (Shadows exist here but won't be in PDF) --- */}
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          
          {/* --- PRINTABLE CONTENT (Ref is here, clean styles only) --- */}
          <div ref={reportRef} className="bg-white p-10 min-h-[297mm]">
            
            {/* Header */}
            <div className="text-center mb-10 border-b-2 border-[#670047] pb-6">
              <h1 className="text-4xl font-bold text-[#670047] mb-2 uppercase">
                University of Vavuniya
              </h1>
              <h2 className="text-xl font-semibold text-gray-600">
                Medical Center Management System
              </h2>
              
              <div className="mt-6 flex justify-center">
                <div className="bg-red-50 text-red-900 border border-red-200 px-6 py-2 rounded-lg">
                  <h3 className="font-bold text-lg">
                    Low Stock Alert Report
                  </h3>
                  <p className="text-sm">{currentMonth}</p>
                </div>
              </div>

              <div className="mt-4 text-right text-xs text-gray-400">
                Generated on: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Table */}
            {lowStock.length === 0 ? (
              <div className="text-center py-10 bg-green-50 rounded-lg border border-green-200 text-green-800">
                <p className="text-lg font-semibold">✅ Inventory Status Healthy</p>
                <p>No drugs are currently below the 100 unit threshold.</p>
              </div>
            ) : (
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-[#670047] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-300">Drug Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border border-gray-300">Dosage</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider border border-gray-300">Current Stock</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider border border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {lowStock.map((d, index) => (
                    <tr key={d._id} className="border border-gray-300">
                      <td className="px-6 py-4 text-gray-900 font-medium border border-gray-300">{d.name}</td>
                      <td className="px-6 py-4 text-gray-600 border border-gray-300">{d.dosage}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800 border border-gray-300">
                        {d.quantity} units
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-300">
                        <span className="text-red-600 font-bold text-xs uppercase bg-red-50 px-2 py-1 rounded border border-red-100">
                          Critical Low
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-12 text-center text-xs text-gray-400">
              <p>This is a system-generated document. Please authorize re-order immediately.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}