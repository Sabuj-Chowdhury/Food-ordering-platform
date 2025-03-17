import { FcGoogle } from "react-icons/fc"; // Google Icon
import { useNavigate } from "react-router-dom"; // Navigation Hook
import RegisterIllustration from "../../assets/10973590.jpg";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { imageUpload } from "../../utils/imagebbAPI";
import { TbFidgetSpinner } from "react-icons/tb";
import GoogleLogin from "../Login/GoogleLogin/GoogleLogin";

const Register = () => {
  const { createUser, updateUserProfile, logOut } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate(); // Initialize navigation
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const image = data.image[0];
    // console.log(image);
    const imageURL = await imageUpload(image);
    const userData = { ...image, ...data, imageURL };
    const { email, password, name, imageURL: photoURL } = userData;
    // console.log(email, password, name, photoURL);

    try {
      // User Registration
      await createUser(email, password);

      // Save username & profile photo
      await updateUserProfile(name, photoURL);

      // toast
      toast.success("Sign up successful, Log in Now!");

      // log out user
      await logOut();

      // redirect user to log in page to login
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
      reset();
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
              required
            />
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
              required
            />
            <input
              {...register("password", {
                pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
                minLength: 6,
              })}
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
              required
            />
            {errors.password && (
              <span>
                password must be at least 6 character must include one
                uppercase, one lowercase and at least one digit
              </span>
            )}

            <input
              {...register("image")}
              type="file"
              accept="image/*"
              id="image"
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B2B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF4B2B] file:text-white hover:file:bg-[#FF6F3C]"
              required
              onChange={handleImageChange}
            />
            {selectedImage && (
              <div className="mt-3">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-20 h-20  object-contain"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4B2B] text-white py-2 rounded-lg font-bold text-lg hover:bg-[#FF6F3C] transition duration-300"
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <TbFidgetSpinner className="animate-spin"></TbFidgetSpinner>{" "}
                  Signing up ..
                </div>
              ) : (
                <>Sign Up</>
              )}
            </button>
          </form>

          {/* Google Sign-Up Button */}
          <GoogleLogin />

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
