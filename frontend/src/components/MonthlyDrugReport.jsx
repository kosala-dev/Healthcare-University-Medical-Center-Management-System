import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function MonthlyDrugReport() {
  const [lowStock, setLowStock] = useState([]);
  const reportRef = useRef(null);
  const navigate = useNavigate();

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetch("http://localhost:8080/drugs/low-stock-report")
      .then((res) => res.json())
      .then((data) => setLowStock(data))
      .catch((err) => console.error(err));
  }, []);

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const element = reportRef.current;
    const originalFont = element.style.fontFamily;
    element.style.fontFamily = "Arial, Helvetica, sans-serif";
    const badge = element.querySelector("#pdf-badge");
    const date = element.querySelector("#pdf-generated-date");
    const badgeStyles = badge ? { ...badge.style } : null;
    const dateStyles = date ? { ...date.style } : null;

    if (badge) {
      badge.style.background = "transparent";
      badge.style.border = "1px solid #999";
      badge.style.borderRadius = "0";
      badge.style.display = "block";
    }

    if (date) {
      date.style.textAlign = "left";
      date.style.marginTop = "12px";
    }

    const opt = {
      margin: [0.8, 0.6, 0.8, 0.6],
      filename: `LowStockReport_${currentMonth.replace(" ", "_")}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        dpi: 300,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

    await html2pdf().set(opt).from(element).save();

    element.style.fontFamily = originalFont;
    if (badge && badgeStyles) Object.assign(badge.style, badgeStyles);
    if (date && dateStyles) Object.assign(date.style, dateStyles);
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gradient-to-r from-[#4A0033] via-[#670047] to-[#9A006C] p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Medical Center Reports
          </h1>
          <p className="text-white/80 mt-2 text-sm">
            Monthly Inventory Analysis
          </p>
        </div>
        <button
          onClick={() => navigate("/drugs")}
          className="w-full bg-white text-[#670047] py-3 rounded-lg font-bold shadow-md hover:bg-gray-100"
        >
          ← Back to Inventory
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Report Preview
          </h2>
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md font-medium flex items-center gap-2"
          >
            📥 Download PDF
          </button>
        </div>

        <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl border overflow-hidden">
          <div
            ref={reportRef}
            id="pdf-content"
            className="bg-white p-10"
              style={{
                width: "100%",
                maxWidth: "210mm",
                minHeight: "297mm",
                margin: "0 auto",
                boxSizing: "border-box",
              }}

          >

          <div className="text-center border-b-2 border-[#670047] pb-6 mb-10">
            <h1 className="text-4xl font-bold text-[#670047]">
              University of Vavuniya
            </h1>
            <h2 className="text-xl font-semibold text-gray-600 mt-1">
              Medical Center Management System
            </h2>

            <div className="mt-6">
              <div
                id="pdf-badge"
                className="inline-block bg-red-50 text-red-900 border border-red-200 px-6 py-2 rounded-lg"
              >
                <h3 className="font-bold text-lg">
                  Low Stock Alert Report
                </h3>
                <p className="text-sm">{currentMonth}</p>
              </div>
            </div>

            <div
              id="pdf-generated-date"
              className="mt-4 text-right text-xs text-gray-400"
            >
              Generated on: {new Date().toLocaleDateString()}
            </div>
          </div>


            {/* Table */}
            {lowStock.length === 0 ? (
              <div className="text-center py-10 bg-green-50 rounded-lg border border-green-200 text-green-800">
                <p className="text-lg font-semibold">
                  ✅ Inventory Status Healthy
                </p>
                <p>No drugs are currently below the threshold.</p>
              </div>
            ) : (
              <table className="w-full border border-gray-300 border-collapse">
                <thead className="bg-[#670047] text-white">
                  <tr>
                    <th className="border px-4 py-3 text-left">Drug Name</th>
                    <th className="border px-4 py-3 text-left">Dosage</th>
                    <th className="border px-4 py-3 text-center">Current Stock</th>
                    <th className="border px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((d) => (
                    <tr key={d._id}>
                      <td className="border px-4 py-3">{d.name}</td>
                      <td className="border px-4 py-3">{d.dosage}</td>
                      <td className="border px-4 py-3 text-center font-bold">
                        {d.quantity} units
                      </td>
                      <td className="border px-4 py-3 text-center">
                        <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded border">
                          Critical Low
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-12 text-center text-xs text-gray-400">
              This is a system-generated document. Please authorize re-order immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
