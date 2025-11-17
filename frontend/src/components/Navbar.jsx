import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

export default function Navbar({ role, userId }) {
  const Navigate = useNavigate();
  const goRegister = () => {
    Navigate("/register");
  };

  const goLogin = () => {
    Navigate("/login");
  };

  const GoLogOut = () => {
    Navigate("/logout");
  };

  const SuperGoAdmindDshboard = () => {
    Navigate("/superadmindashboard");
  };

  const GopatientDashboard = () => {
    Navigate("/patientdashboard");
  };

  const Gototadmindashboard = () => {
    Navigate("/admindashboard");
  };

  return (
    <nav className="w-full h-14 flex flex-wrap justify-between items-center px-4 md:px-20 bg-[#670047] text-white">
      <div className="nav-contains w-full md:w-1/2 text-[16px] font-sans font-bold">
        <ul className="flex space-x-12">
          <li>
            <Link to="/" className="hover:text-[#ffcb00] transition-colors duration-200">Home</Link>
          </li>
          <li>
            <Link to="/Services" className="hover:text-[#ffcb00] transition-colors duration-200">Services</Link>
          </li>
          <li>
            <Link to="/AboutUs" className="hover:text-[#ffcb00] transition-colors duration-200">About us</Link>
          </li>
          <li>
            <Link to="/Gallery" className="hover:text-[#ffcb00] transition-colors duration-200">Gallery</Link>
          </li>
          <li>
            <Link to="/Help" className="hover:text-[#ffcb00] transition-colors duration-200">Help</Link>
          </li>
        </ul>
      </div>

      <div className="flex">
        {role === "superadmin" && (
          <>
            <Button onClick={SuperGoAdmindDshboard} className="mr-3 bg-[#670047] text-white border-2 border-[#ffcb00] px-4 py-2 rounded-lg hover:border-yellow-300 hover:text-yellow-300 transition hover:bg-[#670047]">
              Super Admin Dashboard
            </Button>

            <Button variant="info" className=" mr-3 bg-[#670047] text-white border-2 border-[#ffcb00] px-4 py-2 rounded-lg hover:border-yellow-300 hover:text-yellow-300 transition hover:bg-[#670047]" onClick={GoLogOut}>
              Logout
            </Button>
          </>
        )}
        {role === "patient" && (
          <>
            <Button onClick={GopatientDashboard} className="mr-3 bg-[#670047] text-white border-2 border-[#ffcb00] px-4 py-2 rounded-lg hover:border-yellow-300 hover:text-yellow-300 transition hover:bg-[#670047]">
              Dashboard
            </Button>{" "}
            <Button variant="info" className="mr-3 bg-[#670047] text-white border-2 border-[#ffcb00] px-4 py-2 rounded-lg hover:border-yellow-300 hover:text-yellow-300 transition hover:bg-[#670047]" onClick={GoLogOut}>
              Logout
            </Button>
          </>
        )}
        {role === "admin" && (
          <>
            <Button onClick={Gototadmindashboard} className=" mr-3 bg-[#670047] text-white border-2 border-[#ffcb00] px-4 py-2 rounded-lg hover:border-yellow-300 hover:text-yellow-300 transition hover:bg-[#670047]">
              Admin Dashboard
            </Button>
            <Button variant="info" className=" mr-3 mr-3 bg-[#670047] text-white border-2 border-yellow-400 px-4 py-2 rounded-lg hover:border-yellow-300 hover:text-yellow-300 transition hover:bg-[#670047]"
             onClick={GoLogOut}>
              Logout
            </Button>
          </>
        )}
        {role === "" && (
          <>
            {/*<Button variant="info" className=" mr-3" onClick={goRegister}>
              REGISTER
            </Button>*/}
            <Button variant="dark" onClick={goLogin} className="mr-3 bg-[#670047] text-white border-2 border-[#ffcb00] px-4 py-2 rounded-lg hover:border-yellow-300 hover:text-yellow-300 transition hover:bg-[#670047]">
              LOGIN
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
