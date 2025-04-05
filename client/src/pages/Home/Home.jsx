import Hero from "./components/Hero";
import PopularItems from "./components/PopularItems";
import Services from "./components/Services";

const Home = () => {
  return (
    <div>
      {/* banner/Hero */}
      <Hero />
      {/* popular items */}
      <PopularItems />
      {/* services  */}
      <Services />
    </div>
  );
};

export default Home;
