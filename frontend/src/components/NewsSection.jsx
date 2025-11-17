import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewsSection = () => {
  const navigate = useNavigate();

  const images = [
    "/images/medical1.png",
    "/images/medical2.png",
    "/images/medical3.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);


  return (
    <section className="bg-gray-50 py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Latest News & Announcements
        </h2>

        <div className="relative w-full max-w-3xl h-[450px] mx-auto overflow-hidden rounded-2xl mb-5 flex justify-center items-center bg-gray-100">
          
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index + 1}`}
                className="object-contain flex-shrink-0 w-full h-full"
              />
            ))}
          </div>
        </div>

      
        <div className="flex justify-center gap-2 mb-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>


        <div className="mt-10">

          <button
            onClick={() => navigate("/message")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition-colors"
          >
            Send a Message
          </button>

          
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                if (!token) {
                  navigate("/login", { state: { from: "/submit-medical" } });
                  return;
                }

                const res = await fetch("http://localhost:5000/api/auth/verifypatient", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });

                const data = await res.json();

                if (res.ok && data.login) {
                  navigate("/submit-medical");
                } else {
                  localStorage.removeItem("token");
                  navigate("/login", { state: { from: "/submit-medical" } });
                }
              } catch (err) {
                console.error("Verification error:", err);
                localStorage.removeItem("token");
                navigate("/login", { state: { from: "/submit-medical" } });
              }
            }}
            className="bg-blue-600 text-white px-6 py-3 ml-8 rounded-xl shadow hover:bg-blue-700 transition-colors"
          >
            Submit Medical Form
          </button>


        </div>
      </div>
    </section>
  );
};

export default NewsSection;
