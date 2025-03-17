import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home | Food Delivery</title>
        <meta
          name="description"
          content="Welcome to our food delivery service"
        />
      </Helmet>

      <div className="">
        <p>Home</p>
      </div>
    </div>
  );
};

export default Home;
