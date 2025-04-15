import { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import {
  FaUsers,
  FaBars,
  FaChevronLeft,
  FaStore,
  FaUserCircle,
  FaUtensils,
  FaClipboardList,
  FaConciergeBell,
  FaEdit,
  FaShoppingCart,
  FaHistory,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const SideBar = () => {
  const { logOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const [role, isLoading] = useRole();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const onLogout = async () => {
    await logOut();
    navigate("/");
  };

  if (isLoading) return null;

  return (
    <aside
      className={`bg-[#FF4B2B] text-white h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#FF6F3C]">
        {!isCollapsed && (
          <Link to="/" className="text-2xl font-bold">
            FoodZone
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white text-lg hover:bg-[#FF6F3C] p-2 rounded"
        >
          {isCollapsed ? <FaBars size={22} /> : <FaChevronLeft size={22} />}
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="flex flex-col gap-4 p-4">
        {/* admin routes */}
        {role === "admin" && (
          <NavLink
            to="/dashboard/manage-users"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                isActive ? "bg-[#FF8C5A]" : ""
              }`
            }
          >
            <FaUsers size={22} />
            <span className={`${isCollapsed ? "hidden" : ""}`}>
              Manage Users
            </span>
          </NavLink>
        )}

        {/* User routes */}
        {role === "user" && (
          <>
            <NavLink
              to="/dashboard/my-orders"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                  isActive ? "bg-[#FF8C5A]" : ""
                }`
              }
            >
              <FaShoppingCart size={22} />
              <span className={`${isCollapsed ? "hidden" : ""}`}>
                My Orders
              </span>
            </NavLink>

            <NavLink
              to="/dashboard/payment-history"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                  isActive ? "bg-[#FF8C5A]" : ""
                }`
              }
            >
              <FaHistory size={22} />
              <span className={`${isCollapsed ? "hidden" : ""}`}>
                Payment History
              </span>
            </NavLink>
            <NavLink
              to="/dashboard/request"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                  isActive ? "bg-[#FF8C5A]" : ""
                }`
              }
            >
              <FaStore size={22} />
              <span className={`${isCollapsed ? "hidden" : ""}`}>
                Become Seller
              </span>
            </NavLink>
          </>
        )}

        {/* seller routes */}

        {role === "seller" && (
          <>
            <NavLink
              to="/dashboard/add-restaurant/"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                  isActive ? "bg-[#FF8C5A]" : ""
                }`
              }
            >
              <FaStore size={22} />
              <span className={`${isCollapsed ? "hidden" : ""}`}>
                Add Restaurant
              </span>
            </NavLink>

            <NavLink
              to="/dashboard/manage-menu"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                  isActive ? "bg-[#FF8C5A]" : ""
                }`
              }
            >
              <FaEdit size={22} />
              <span className={`${isCollapsed ? "hidden" : ""}`}>
                Manage Menu
              </span>
            </NavLink>

            <NavLink
              to="/dashboard/manage-orders"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                  isActive ? "bg-[#FF8C5A]" : ""
                }`
              }
            >
              <FaClipboardList size={22} />
              <span className={`${isCollapsed ? "hidden" : ""}`}>
                Manage Orders
              </span>
            </NavLink>

            <NavLink
              to="/dashboard/my-restaurant"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
                  isActive ? "bg-[#FF8C5A]" : ""
                }`
              }
            >
              <FaConciergeBell size={22} />
              <span className={`${isCollapsed ? "hidden" : ""}`}>
                My Restaurant
              </span>
            </NavLink>
          </>
        )}

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-lg hover:bg-[#FF6F3C] transition ${
              isActive ? "bg-[#FF8C5A]" : ""
            }`
          }
        >
          <FaUserCircle size={22} />
          <span className={`${isCollapsed ? "hidden" : ""}`}>Profile</span>
        </NavLink>

        <button
          onClick={onLogout}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-red-500 transition"
        >
          <FiLogOut size={22} />
          <span className={`${isCollapsed ? "hidden" : ""}`}>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;
