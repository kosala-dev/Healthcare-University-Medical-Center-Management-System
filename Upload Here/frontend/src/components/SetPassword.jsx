import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function SetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8080/reset-password/${token}`,
        { password }
      );
      setMsg(res.data.message);
    } catch {
      setMsg("Invalid or expired link");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Set New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Save Password</button>
      <p>{msg}</p>
    </form>
  );
}
