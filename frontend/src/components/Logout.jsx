import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Logout = ({ setRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiUrl}/auth/logout`, { withCredentials: true })
      .then((res) => {
        if (res.data.logout) {
          if (setRole) {
            setRole("");
          }
          sessionStorage.clear();
          localStorage.clear();
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        sessionStorage.clear();
        localStorage.clear();
        navigate("/");
      });
  }, [navigate, setRole]);

  return null;
};

export default Logout;
