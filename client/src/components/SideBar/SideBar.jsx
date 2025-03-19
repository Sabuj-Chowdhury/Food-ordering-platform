import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { FiLogOut } from "react-icons/fi";
import { FaUsers, FaBars, FaChevronLeft } from "react-icons/fa"; // New icons
import useAuth from "../../hooks/useAuth";
import useAdmin from "../../hooks/useAdmin";

const SideBar = () => {
  const { logOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const onLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <aside
      className={`bg-[#FF4B2B] text-white h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#FF6F3C]">
        {!isCollapsed && <h1 className="text-2xl font-bold">FoodZone</h1>}
        <button
          onClick={toggleSidebar}
          className="text-white text-lg hover:bg-[#FF6F3C] p-2 rounded"
        >
          {isCollapsed ? <FaBars size={22} /> : <FaChevronLeft size={22} />}
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="flex flex-col gap-4 p-4">
        {isAdmin && (
          <NavLink
            to="/dashboard/manage-users"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                isActive ? "bg-[#FF8C5A]" : ""
              }`
            }
          >
            <FaUsers size={22} />
            <span className={`${isCollapsed && "hidden"}`}>Manage Users</span>
          </NavLink>
        )}

        {/* Profile */}
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
              isActive ? "bg-[#FF8C5A]" : ""
            }`
          }
        >
          <ImProfile size={22} />
          <span className={`${isCollapsed && "hidden"}`}>Profile</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-red-500 transition"
        >
          <FiLogOut size={22} />
          <span className={`${isCollapsed && "hidden"}`}>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;
