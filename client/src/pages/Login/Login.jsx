import { useLocation, useNavigate } from "react-router-dom"; // Navigation Hook
import LoginIllustration from "../../assets/Mobile login-cuate.svg"; // Import SVG
import { TbFidgetSpinner } from "react-icons/tb"; // Spinner Icon
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import GoogleLogin from "./GoogleLogin/GoogleLogin";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate(); // Initialize navigation

  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setLoading(true);
    // console.log(data);
    const { email, password } = data;
    // console.log(email, password);
    try {
      //sign in with email and password
      await signIn(email, password);
      navigate(from, { replace: true });
      toast.success("Login Successful!");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Content Wrapper */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full flex flex-col md:flex-row items-center gap-6">
        {/* SVG Illustration */}
        <div className="hidden md:block w-1/2">
          <img
            src={LoginIllustration}
            alt="Login Illustration"
            className="w-full"
          />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 text-center">
          <h2 className="text-3xl font-bold text-[#FF4B2B] mb-6 playfair-display">
            Login to FoodZone
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
              required
            />
            <input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4B2B] text-white py-2 rounded-lg font-bold text-lg hover:bg-[#FF6F3C] transition duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-center">
                  <TbFidgetSpinner className="animate-spin"></TbFidgetSpinner>{" "}
                  Logging in ..
                </div>
              ) : (
                <>Log In</>
              )}
            </button>
          </form>

          {/* Google Login Button */}
          <GoogleLogin />

          <p className="mt-4 text-[#2E2E2E] poppins">
            Don't have an account?{" "}
            <a href="/register" className="text-[#FF6F3C] font-semibold">
              Sign Up
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

export default Login;
