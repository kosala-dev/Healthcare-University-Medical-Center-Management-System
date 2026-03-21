import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await fetch("http://localhost:8080/auth/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ token: idToken })
      });

      const data = await response.json();
      if (!response.ok) {
        setMsg(data.error || "Invalid email");
        return;
      }


      if (data.success) {
        if (data.role === "superadmin") navigate("/superadmindashboard");
        else if (data.role === "admin") navigate("/admindashboard");
        else if (data.role === "advisor") navigate("/advisordashboard");
        else if (data.role === "hod") navigate("/hoddashboard");
        else if (data.role === "dean") navigate("/deandashboard");
        else if (data.role === "patient") navigate("/patientdashboard");
        else navigate("/login");
      }

    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}

export default Login;