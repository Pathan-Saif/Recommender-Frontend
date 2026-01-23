import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Recommendations from "./pages/Recommendations";
import Header from "./components/Header";


function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login onLogin={u => { setUser(u); navigate("/products"); }} />} />
          <Route path="/products" element={<Products user={user} />} />
          <Route path="/recommendations" element={<Recommendations user={user} />} />
          <Route path="*" element={<Login onLogin={u => { setUser(u); navigate("/products"); }} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
