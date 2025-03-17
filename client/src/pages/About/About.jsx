import { Helmet } from "react-helmet";

const About = () => {
  return (
    <div className=" bg-[#FAF3E0] text-[#2E2E2E] inter flex flex-col items-center px-0 py-5 overflow-hidden">
      <h1 className="text-4xl font-bold playfair-display text-[#FF4B2B]">
        About FoodZone
      </h1>
      <p className="max-w-3xl text-lg text-center poppins mt-4 px-4">
        Welcome to{" "}
        <span className="text-[#FF6F3C] font-semibold">FoodZone</span>, your
        go-to platform for delicious meals delivered right to your doorstep. We
        connect you with the best restaurants in town, ensuring fresh and
        high-quality food whenever you crave it.
      </p>
      <p className="max-w-3xl text-lg text-center poppins mt-4 px-4">
        Our mission is to make food ordering seamless, convenient, and
        enjoyable. Whether you're looking for a quick bite or a fine dining
        experience at home,
        <span className="text-[#FF4B2B] font-semibold"> FoodZone</span> has got
        you covered.
      </p>

      {/* Image Section */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 w-full px-4">
        <img
          src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGRlbGl2ZXJ5fGVufDB8fDB8fHww"
          alt="Food Delivery"
          className="h-full w-full md:w-1/2 md:h-64 object-cover rounded-xl shadow-lg"
        />
        <img
          src="https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Restaurant"
          className=" h-full w-full md:w-1/2 md:h-64 object-cover rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default About;
