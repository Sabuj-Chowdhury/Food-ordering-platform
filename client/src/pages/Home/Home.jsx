import Hero from "./components/Hero";
import PopularItems from "./components/PopularItems";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

const Home = () => {
  return (
    <div>
      {/* banner/Hero */}
      <Hero />
      {/* popular items */}
      <PopularItems />
      {/* services  */}
      <Services />
      {/* Testimonial */}
      <Testimonials />
    </div>
  );
};

export default Home;
