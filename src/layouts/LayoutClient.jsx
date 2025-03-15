import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Banner from "./Banner";

const LayoutClient = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LayoutClient;
