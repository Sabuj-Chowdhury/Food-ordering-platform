import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onLogout = async () => {
    await logOut();
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="sticky top-0 z-30 w-full bg-[#121212] shadow-lg text-white px-6 py-4 inter">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        {/* logo/name */}
        <Link
          to="/"
          className="text-3xl font-bold text-[#FF4B2B] playfair-display"
        >
          FoodZone
        </Link>

        {/* large screen links (centered) */}
        <div className="hidden md:flex space-x-6 text-lg poppins">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl transition duration-300 ease-in-out ${
                isActive
                  ? "bg-[#FF4B2B] text-white shadow-lg"
                  : "hover:text-[#FF6F3C]"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl transition duration-300 ease-in-out ${
                isActive
                  ? "bg-[#FF4B2B] text-white shadow-lg"
                  : "hover:text-[#FF6F3C]"
              }`
            }
          >
            Restaurants
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl transition duration-300 ease-in-out ${
                isActive
                  ? "bg-[#FF4B2B] text-white shadow-lg"
                  : "hover:text-[#FF6F3C]"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl transition duration-300 ease-in-out ${
                isActive
                  ? "bg-[#FF4B2B] text-white shadow-lg"
                  : "hover:text-[#FF6F3C]"
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* AUTH:login/register */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative flex items-center">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  src={user?.photoURL}
                  alt="user"
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-white">▼</span>
              </div>
              {dropdownOpen && (
                <div className="absolute top-16 -mt-3 -right-3 bg-[#1E1E1E] text-white rounded-xl shadow-2xl w-48 text-center overflow-hidden border border-[#FF4B2B]/20">
                  <p className="text-center py-3 border-b border-[#FF4B2B]/20 font-medium">
                    {user.displayName}
                  </p>
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-3 hover:bg-[#FF4B2B] transition-all duration-300 border-b border-[#FF4B2B]/20 text-center"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 hover:bg-[#FF4B2B] transition-all duration-300 text-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-[#B6FF69] text-black px-4 py-2 rounded-xl font-semibold hover:bg-[#FF9F68] transition"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <div className="relative flex items-center">
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  src={user?.photoURL}
                  alt="user"
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-white">▼</span>
              </div>
              {dropdownOpen && (
                <div className="absolute top-16 -mt-3 -right-10 bg-[#1E1E1E] text-white rounded-xl shadow-2xl w-48 text-center overflow-hidden border border-[#FF4B2B]/20">
                  <p className="text-center py-3 border-b border-[#FF4B2B]/20 font-medium">
                    {user.displayName}
                  </p>
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-3 hover:bg-[#FF4B2B] transition-all duration-300 border-b border-[#FF4B2B]/20"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 hover:bg-[#FF4B2B] transition-all duration-300 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? (
              <AiOutlineClose size={24} className="cursor-pointer" />
            ) : (
              <AiOutlineMenu size={24} className="cursor-pointer" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 right-0 w-full h-screen bg-[#121212] shadow-lg transform transition-all duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 relative">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 focus:outline-none"
            >
              <AiOutlineClose size={24} className="cursor-pointer" />
            </button>

            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 w-3/4 text-center text-xl ${
                  isActive ? "bg-[#FF4B2B]" : "hover:bg-[#FF4B2B]/20"
                } rounded-xl transition-all duration-300`
              }
              onClick={toggleMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/restaurants"
              className={({ isActive }) =>
                `px-4 py-2 w-3/4 text-center text-xl ${
                  isActive ? "bg-[#FF4B2B]" : "hover:bg-[#FF4B2B]/20"
                } rounded-xl transition-all duration-300`
              }
              onClick={toggleMenu}
            >
              Restaurants
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-4 py-2 w-3/4 text-center text-xl ${
                  isActive ? "bg-[#FF4B2B]" : "hover:bg-[#FF4B2B]/20"
                } rounded-xl transition-all duration-300`
              }
              onClick={toggleMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 w-3/4 text-center text-xl ${
                  isActive ? "bg-[#FF4B2B]" : "hover:bg-[#FF4B2B]/20"
                } rounded-xl transition-all duration-300`
              }
              onClick={toggleMenu}
            >
              Contact
            </NavLink>
            {!user && (
              <NavLink
                to="/login"
                className="bg-[#B6FF69] text-black px-6 py-2 w-3/4 text-center text-xl rounded-xl font-semibold hover:bg-[#FF9F68] transition-all duration-300"
                onClick={toggleMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
