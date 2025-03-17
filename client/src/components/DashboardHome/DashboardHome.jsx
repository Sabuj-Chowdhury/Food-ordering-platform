import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import bgImage from "../../assets/premium_photo-1664301414848-e46b0636fd2c.avif";
import { FaUser, FaHome, FaBell, FaStar, FaUserCircle } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div
      className="h-full w-full bg-cover bg-center bg-no-repeat inter"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
      }}
    >
      {/* Welcome Section with User Info */}
      <div className="bg-gradient-to-r from-[#FF4B2B]/80 to-[#FF6F3C]/80 p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-16 h-16 rounded-full border-2 border-white"
            />
          ) : (
            <FaUserCircle className="w-16 h-16 text-white" />
          )}
          <div>
            <h1 className="text-4xl font-bold text-white playfair-display">
              Welcome back, {user?.displayName || "User"} 👋
            </h1>
            <div className="flex items-center gap-3 mt-2 text-white/90 poppins">
              <MdEmail className="text-lg" />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card with Stats */}
          <Link
            to="/dashboard/profile"
            className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-all transform group-hover:scale-110">
                <FaUser className="text-2xl text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 poppins">
                  My Profile
                </h3>
                <p className="text-gray-500 inter">View and edit your information</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
              <div className="text-center">
                <FaBell className="text-teal-600 text-xl mx-auto mb-2" />
                <p className="text-sm text-gray-600 poppins">Notifications</p>
                <p className="font-semibold inter">3 New</p>
              </div>
              <div className="text-center">
                <FaStar className="text-teal-600 text-xl mx-auto mb-2" />
                <p className="text-sm text-gray-600 poppins">Rating</p>
                <p className="font-semibold inter">4.8/5</p>
              </div>
            </div>
          </Link>

          {/* Homepage Card */}
          <Link
            to="/"
            className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-all transform group-hover:scale-110">
                <FaHome className="text-2xl text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 poppins">
                  Homepage
                </h3>
                <p className="text-gray-500 inter">Return to main site</p>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center gap-2 text-gray-600 inter">
                <MdLocationOn className="text-lg text-teal-600" />
                <span>Explore local restaurants and deals</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
