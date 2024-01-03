import "./navbar.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setOpenModal(false);
    try {
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      await axios.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">MyBooking.com</span>
        </Link>
        <div className="navItems">
          {user ? (
            <>
              <p>{user.username}</p>
              <img
                className="profile"
                onClick={() => setOpenModal((pre) => !pre)}
                src="./profile.svg"
                alt=""
              />
            </>
          ) : (
            <>
              <button className="navButton">Register</button>
              <button className="navButton" onClick={() => navigate("/login")}>
                Login
              </button>
            </>
          )}

          {openModal && (
            <div className="modal">
              <button onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
