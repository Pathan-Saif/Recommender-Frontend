import React from "react";
import { Link } from "react-router-dom";

export default function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="nav">
        <Link to="/products" className="brand">Recommender</Link>
        <nav>
          <Link to="/products">Products</Link>
          <Link to="/recommendations">Recommendations</Link>
          {user ? (
            <button onClick={onLogout} className="btn small">Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}