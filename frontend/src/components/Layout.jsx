import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar
        open={open}
        setOpen={setOpen}
      />

      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="main-container">
        <Navbar setOpen={setOpen} />

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
