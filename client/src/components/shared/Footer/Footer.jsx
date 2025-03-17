import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#121212] text-white py-8 mt-16 text-center">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div>
          <h2 className="text-2xl font-bold text-[#FF4B2B]">FoodZone</h2>
          <p className="text-gray-400 mt-2">
            Bringing delicious food to your doorstep!
          </p>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-xl hover:text-[#FF6F3C] transition">
            <FaFacebook />
          </a>
          <a href="#" className="text-xl hover:text-[#FF6F3C] transition">
            <FaInstagram />
          </a>
          <a href="#" className="text-xl hover:text-[#FF6F3C] transition">
            <FaTwitter />
          </a>
        </div>
      </div>
      <p className="text-gray-500 mt-6">
        &copy; 2025 FoodZone. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
