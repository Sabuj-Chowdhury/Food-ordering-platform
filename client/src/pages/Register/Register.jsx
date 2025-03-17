import { FcGoogle } from "react-icons/fc"; // Google Icon
import { useNavigate } from "react-router-dom"; // Navigation Hook
import RegisterIllustration from "../../assets/10973590.jpg"; // Use same SVG for now

const Register = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Content Wrapper */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full flex flex-col md:flex-row items-center gap-6">
        {/* SVG Illustration */}
        <div className="hidden md:block w-1/2">
          <img
            src={RegisterIllustration}
            alt="Register Illustration"
            className="w-full"
          />
        </div>

        {/* Registration Form */}
        <div className="w-full md:w-1/2 text-center">
          <h2 className="text-3xl font-bold text-[#FF4B2B] mb-6 playfair-display">
            Create an Account
          </h2>
          <form>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
            />
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF4B2B] file:text-white hover:file:bg-[#FF6F3C]"
            />
            <button
              type="submit"
              className="w-full bg-[#FF4B2B] text-white py-2 rounded-lg font-bold text-lg hover:bg-[#FF6F3C] transition duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Google Sign-Up Button */}
          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300">
            <FcGoogle className="text-2xl" />
            <span className="text-[#2E2E2E] font-semibold">
              Sign Up with Google
            </span>
          </button>

          <p className="mt-4 text-[#2E2E2E] poppins">
            Already have an account?{" "}
            <a href="/login" className="text-[#FF6F3C] font-semibold">
              Login
            </a>
          </p>

          {/* Go Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 text-[#FF4B2B] font-bold hover:underline"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
