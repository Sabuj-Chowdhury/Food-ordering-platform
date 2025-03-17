import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-30 w-full bg-[#121212] shadow-lg text-white px-6 py-4 inter">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* logo/name */}
        <div className="text-3xl font-bold text-[#FF4B2B] playfair-display">
          FoodZone
        </div>
        {/* menu */}
        <div className="flex space-x-6 text-lg poppins">
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
        {/* login/register */}
        <div>
          <NavLink
            to="/login"
            className="bg-[#B6FF69] text-black px-4 py-2 rounded-xl font-semibold hover:bg-[#FF9F68] transition"
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
