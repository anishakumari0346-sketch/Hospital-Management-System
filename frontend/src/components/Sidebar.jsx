import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Sidebar = ({ open, setOpen }) => {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: <FaUserMd />,
    },
    {
      name: "Patients",
      path: "/patients",
      icon: <FaUsers />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Billing",
      path: "/billing",
      icon: <FaFileInvoiceDollar />,
    },
  ];

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-logo">
        🏥 HMS
      </div>

      <div className="sidebar-links">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
