import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ setOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="top-navbar">
      <button
        className="menu-btn"
        onClick={() => setOpen(true)}
      >
        <FaBars />
      </button>

      <div className="navbar-title">
        Hospital Management System
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <strong>
            {user?.name || "Admin"}
          </strong>

          <small>
            {user?.email || ""}
          </small>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
