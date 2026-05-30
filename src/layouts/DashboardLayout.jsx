import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";

import "./DashboardLayout.css";

function DashboardLayout({ children }) {

  const [collapsed, setCollapsed] =
    useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (

    <div className="dashboard-layout">

      <Sidebar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
      />

      <main
        className={
          collapsed
            ? "dashboard-content collapsed"
            : "dashboard-content"
        }
      >
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;