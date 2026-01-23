import React, { useState } from "react";
import { login, register } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = isRegister
        ? await register({ email, password, name })
        : await login({ email, password });

      const { token, userId, name: uname, email: uemail } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      const user = { userId, name: uname, email: uemail };
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError("Authentication failed");
    }
  };

  return (
    <div className="center-page">
      <div className="card">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={submit}>
          {isRegister && <>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </>}
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />

          <button className="btn">{isRegister ? "Register" : "Login"}</button>
          <button type="button" className="btn ghost" onClick={() => setIsRegister(!isRegister)}>Switch</button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
