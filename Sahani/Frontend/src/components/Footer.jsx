import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="flex flex-wrap justify-around pb-7 text-white gap-y-6">
      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold">Quick Links</h4>
        <ul className="flex flex-col space-y-2 mt-3 text-white">
          <li>
            <Link
              to={"/"}
              className="hover:text-[#ffcb00] transition-colors duration-200"
            >
              ❯ Home
            </Link>
          </li>
          <li>
            <Link
              to={"/Services"}
              className="hover:text-[#ffcb00] transition-colors duration-200"
            >
              ❯ Services
            </Link>
          </li>
          <li>
            <Link
              to={"/Aboutus"}
              className="hover:text-[#ffcb00] transition-colors duration-200"
            >
              ❯ About us
            </Link>
          </li>
        </ul>
      </div>

      {/* Contact Us */}
      <div>
        <h4 className="text-lg font-semibold">Contact us</h4>
        <ul className="flex flex-col space-y-2 mt-3 text-[#ffcb00]">
          <li> Mobile: 011XXXXXXX</li>
          <li> Gmail: medicalcenter@uov.ac.lk</li>
          <li> Address: University of Vavuniya, Pampeimadu, Vavuniya</li>
        </ul>
      </div>

      {/* Open Hours */}
      <div>
        <h4 className="text-lg font-semibold">Open Hours</h4>
        <ul className="flex flex-col space-y-2 mt-3 text-[#ffcb00]">
          <li>
            <span>Monday</span> <span>8:30am - 4:00pm</span>
          </li>
          <li >
            <span>Tuesday</span> <span>8:30am - 4:00pm</span>
          </li>
          <li >
            <span>Wednesday</span> <span>8:30am - 4:00pm</span>
          </li>
          <li >
            <span>Friday</span> <span>8:30am - 4:00pm</span>
          </li>
          <li>
            <span>Saturday</span> <span>9:00am - 12:00pm</span>
          </li>
          <li>
            <span>Sunday</span> <span>Closed</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
