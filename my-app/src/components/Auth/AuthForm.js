import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./AuthForm.module.css";
import axios from "axios"; // Make sure axios is installed

const AuthForm = () => {
  // State to hold email and password
  const [email, setEmail] = useState("dealsdray@gmail.com");
  const [password, setPassword] = useState("dealsdray");
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email);
      navigate("/");
      // Handle successful login (e.g., redirect, store token, etc.)
    } catch (err) {
      console.error("Login error:", err?.response?.data);
      setError(
        err?.response?.data?.message || "Invalid credentials. Please try again."
      ); // Display error message
      alert(err?.response?.data?.message)
    }
    setEmail("");
    setPassword("");
    setError(null);
  };

  return (
    <section className={classes.auth}>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className={classes.error}>{error}</p>}{" "}
        {/* Display error message */}
        <div className={classes.control}>
          <label htmlFor="email">Username</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={classes.actions}>
          <button type="submit">Login</button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
