import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-around gap-y-6 px-4 sm:px-10 py-7 text-white">

      <div className="flex-1 min-w-[180px]">
        <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
        <ul className="flex flex-col space-y-2 text-white">
          <li>
            <Link
              to="/"
              className="hover:text-[#ffcb00] transition-colors duration-200"
            >
              ❯ Home
            </Link>
          </li>
          <li>
            <Link
              to="/Services"
              className="hover:text-[#ffcb00] transition-colors duration-200"
            >
              ❯ Services
            </Link>
          </li>
          <li>
            <Link
              to="/Aboutus"
              className="hover:text-[#ffcb00] transition-colors duration-200"
            >
              ❯ About us
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 min-w-[180px]">
        <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
        <ul className="flex flex-col space-y-2 text-[#ffcb00]">
          <li>Mobile: 011XXXXXXX</li>
          <li>Email: medicalcenter@uov.ac.lk</li>
          <li>Address: University of Vavuniya, Pampeimadu, Vavuniya</li>
        </ul>
      </div>

      <div className="flex-1 min-w-[180px]">
        <h4 className="text-lg font-semibold mb-3">Open Hours</h4>
        <ul className="flex flex-col space-y-2 text-[#ffcb00]">
          <li><span>Monday:</span> <span>8:30am - 4:00pm</span></li>
          <li><span>Tuesday:</span> <span>8:30am - 4:00pm</span></li>
          <li><span>Wednesday:</span> <span>8:30am - 4:00pm</span></li>
          <li><span>Thursday:</span> <span>8:30am - 4:00pm</span></li>
          <li><span>Friday:</span> <span>8:30am - 4:00pm</span></li>
          <li><span>Saturday:</span> <span>9:00am - 12:00pm</span></li>
          <li><span>Sunday:</span> <span>Closed</span></li>
        </ul>
      </div>

    </div>
  );
}
