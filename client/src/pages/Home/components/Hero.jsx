const Hero = () => {
  return (
    <div className="relative w-full h-[55vh] md:h-[60vh] lg:h-[70vh] overflow-hidden flex items-center justify-center text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full  h-[55vh] md:h-[60vh] lg:h-[70vh] object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/3195650/3195650-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Hero Content */}
      <div className="relative text-center px-6">
        <h1 className="text-5xl font-bold playfair-display text-[#FF4B2B] mb-6">
          Welcome to FoodZone
        </h1>
        <p className="text-lg poppins max-w-2xl mx-auto">
          Experience the best food delivery service with a variety of cuisines,
          fast delivery, and secure payments.
        </p>
        <button className="mt-6 bg-[#FF4B2B] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#FF6F3C] transition duration-300">
          Order Now
        </button>
      </div>
    </div>
  );
};

export default Hero;
