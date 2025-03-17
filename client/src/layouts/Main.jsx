import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer/Footer";
import Navbar from "../components/shared/Navbar/Navbar";

const Main = () => {
  return (
    <main>
      {/* Navbar */}
      <Navbar />
      {/* Outlet */}
      <div>
        <Outlet />
      </div>
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Main;
