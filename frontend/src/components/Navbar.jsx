import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function Navbar({ role, userId }) {
  const Navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const Gotohoddashboard = () => {
    Navigate("/hoddashboard");
  };

  const Gotodeandashboard = () => {
    Navigate("/deandashboard");
  };

  const Gotoadvisordashboard = () => {
    Navigate("/advisordashboard");
  };


return (
  <nav className="w-full bg-[#670047] text-white px-4 md:px-20">

    <div className="flex items-center justify-between h-14">

      <div className="font-bold text-lg">
        Uni Health
      </div>

      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <ul className="hidden md:flex space-x-8 text-[16px] font-bold">
        <li><Link to="/" className="hover:text-[#ffcb00]">Home</Link></li>
        <li><Link to="/Services" className="hover:text-[#ffcb00]">Services</Link></li>
        <li><Link to="/AboutUs" className="hover:text-[#ffcb00]">About us</Link></li>
        <li><Link to="/Gallery" className="hover:text-[#ffcb00]">Gallery</Link></li>
        <li><Link to="/Help" className="hover:text-[#ffcb00]">Help</Link></li>
      </ul>

      <div className="hidden md:flex items-center">
        {role === "superadmin" && (
          <>
            <Button onClick={SuperGoAdmindDshboard} className="mr-3 border-2 border-[#ffcb00] bg-[#670047]">
              Super Admin Dashboard
            </Button>
            <Button onClick={GoLogOut} className="border-2 border-[#ffcb00] bg-[#670047]">
              Logout
            </Button>
          </>
        )}

        {role === "patient" && (
          <>
            <Button onClick={GopatientDashboard} className="mr-3 border-2 border-[#ffcb00] bg-[#670047]">
              Dashboard
            </Button>
            <Button onClick={GoLogOut} className="border-2 border-[#ffcb00] bg-[#670047]">
              Logout
            </Button>
          </>
        )}

        {role === "admin" && (
          <>
            <Button onClick={Gototadmindashboard} className="mr-3 border-2 border-[#ffcb00] bg-[#670047]">
              Admin Dashboard
            </Button>
            <Button onClick={GoLogOut} className="border-2 border-[#ffcb00] bg-[#670047]">
              Logout
            </Button>
          </>
        )}

        {role === "hod" && (
          <>
            <Button onClick={Gotohoddashboard} className="mr-3 border-2 border-[#ffcb00] bg-[#670047]">
              Admin Dashboard
            </Button>
            <Button onClick={GoLogOut} className="border-2 border-[#ffcb00] bg-[#670047]">
              Logout
            </Button>
          </>
        )}

        {role === "dean" && (
          <>
            <Button onClick={Gotodeandashboard} className="mr-3 border-2 border-[#ffcb00] bg-[#670047]">
              Admin Dashboard
            </Button>
            <Button onClick={GoLogOut} className="border-2 border-[#ffcb00] bg-[#670047]">
              Logout
            </Button>
          </>
        )}

        {role === "advisor" && (
          <>
            <Button onClick={Gotoadvisordashboard} className="mr-3 border-2 border-[#ffcb00] bg-[#670047]">
              Admin Dashboard
            </Button>
            <Button onClick={GoLogOut} className="border-2 border-[#ffcb00] bg-[#670047]">
              Logout
            </Button>
          </>
        )}

        {role === "" && (
          <Button onClick={goLogin} className="border-2 border-[#ffcb00] bg-[#670047] hover:bg-[#670010] hover:border-[#ffcb00]">
            LOGIN
          </Button>
        )}
      </div>
    </div>

    {/* MOBILE DROPDOWN */}
    {menuOpen && (
      <div className="md:hidden flex flex-col space-y-4 py-4 border-t border-[#ffcb00]">

        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/Services" onClick={() => setMenuOpen(false)}>Services</Link>
        <Link to="/AboutUs" onClick={() => setMenuOpen(false)}>About us</Link>
        <Link to="/Gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
        <Link to="/Help" onClick={() => setMenuOpen(false)}>Help</Link>

        <div className="pt-2 flex flex-col space-y-2">
          {role === "superadmin" && (
            <>
              <Button onClick={SuperGoAdmindDshboard}>Super Admin Dashboard</Button>
              <Button onClick={GoLogOut}>Logout</Button>
            </>
          )}

          {role === "patient" && (
            <>
              <Button onClick={GopatientDashboard}>Dashboard</Button>
              <Button onClick={GoLogOut}>Logout</Button>
            </>
          )}

          {role === "admin" && (
            <>
              <Button onClick={Gototadmindashboard}>Admin Dashboard</Button>
              <Button onClick={GoLogOut}>Logout</Button>
            </>
          )}

          {role === "hod" && (
            <>
              <Button onClick={Gotohoddashboard}>Admin Dashboard</Button>
              <Button onClick={GoLogOut}>Logout</Button>
            </>
          )}

          {role === "dean" && (
            <>
              <Button onClick={Gotodeandashboard}>Admin Dashboard</Button>
              <Button onClick={GoLogOut}>Logout</Button>
            </>
          )}

          {role === "advisor" && (
            <>
              <Button onClick={Gotoadvisordashboard}>Admin Dashboard</Button>
              <Button onClick={GoLogOut}>Logout</Button>
            </>
          )}

        </div>
      </div>
    )}
  </nav>
);
}
