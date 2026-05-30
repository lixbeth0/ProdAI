import "./Sidebar.css";

import logo from "../../assets/logo.png";

import { motion } from "framer-motion";

import { sidebarData } from "./sidebarData";

import SidebarItem from "./SidebarItem";

import { Link } from "react-router-dom";


function Sidebar({
  collapsed,
  toggleSidebar
}) {

  return (

    <motion.aside

      animate={{
        width: collapsed ? 90 : 260
      }}

      transition={{
        duration: 0.3
      }}

      className={
        collapsed
          ? "sidebar collapsed"
          : "sidebar"
      }
    >

      {/* LOGO */}
      <div className="sidebar-top">

        <img
          src={logo}
          className="sidebar-logo"
        />

        {!collapsed && (
          <h2 className="h2-nombre">ProdAI</h2>
        )}

      </div>
      
      {/* BOTON */}
      <button
        className="collapse-btn"
        onClick={toggleSidebar}
      >
        ☰ 
        
      </button>


      {/* MENU */}
      <nav className="sidebar-menu">

        {sidebarData.map((item) => (

          <SidebarItem
            key={item.title}
            item={item}
            collapsed={collapsed}
          />

        ))}

      </nav>

    </motion.aside>
  );
}

export default Sidebar;