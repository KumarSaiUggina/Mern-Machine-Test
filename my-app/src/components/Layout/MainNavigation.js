import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Check if the token exists in local storage to determine login state
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email"); // Get email from localStorage
    setIsLoggedIn(!!token);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleLogout = async () => {
    // Clear token and update login state
    await localStorage.removeItem("token");
    await localStorage.removeItem("email");
    setIsLoggedIn(false);
    setEmail(null);
    window.location.reload(false);
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>DealsDray</div>
      </Link>
      <nav>
        <ul>
          {isLoggedIn && (
            <li>
              <Link to="/">Home</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/employeeList">Employee List</Link>
            </li>
          )}

          {/* Show email if logged in */}
          {isLoggedIn && <li>{email}</li>}

          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
