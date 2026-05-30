import { NavLink } from "react-router-dom";

function SidebarItem({
  item,
  collapsed
}) {

  const Icon = item.icon;

  return (

    <NavLink
      to={item.path}

      className={({ isActive }) =>
        isActive
          ? "sidebar-item active"
          : "sidebar-item"
      }
    >

      <Icon size={22} />

      {!collapsed && (
        <span>{item.title}</span>
      )}

    </NavLink>
  );
}

export default SidebarItem;