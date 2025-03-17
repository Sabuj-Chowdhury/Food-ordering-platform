const Services = () => {
  return (
    <div className="py-16 bg-[#FAF3E0] text-[#2E2E2E] text-center">
      <h2 className="text-4xl font-bold playfair-display text-[#FF4B2B] mb-6 hover:scale-105 transition-transform duration-300">
        Our Services
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Service 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="w-32 h-32 overflow-hidden rounded-full mb-4">
            <img
              src="https://images.unsplash.com/photo-1616703833506-fd23c01c3e8f?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fast Delivery"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-semibold text-[#FF6F3C] hover:text-[#FF4B2B] transition-colors duration-300">
            Fast Delivery
          </h3>
          <p className="text-lg mt-2 poppins">
            Get your food delivered in no time with our efficient delivery
            system.
          </p>
        </div>

        {/* Service 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="w-32 h-32 overflow-hidden rounded-full mb-4">
            <img
              src="https://plus.unsplash.com/premium_photo-1695582868702-5b0f91584d00?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Variety of Cuisines"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-semibold text-[#FF6F3C] hover:text-[#FF4B2B] transition-colors duration-300">
            Variety of Cuisines
          </h3>
          <p className="text-lg mt-2 poppins">
            Choose from a wide range of restaurants and cuisines.
          </p>
        </div>

        {/* Service 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <div className="w-32 h-32 overflow-hidden rounded-full mb-4">
            <img
              src="https://plus.unsplash.com/premium_photo-1681760172620-98a67f93b08a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Secure Payment"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-semibold text-[#FF6F3C] hover:text-[#FF4B2B] transition-colors duration-300">
            Secure Payment
          </h3>
          <p className="text-lg mt-2 poppins">
            Multiple secure payment options for a hassle-free checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
