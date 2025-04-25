import { Outlet } from "react-router-dom";
import { useLoading } from "../hooks/useLoading";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Footer from "../components/client/Footer";


const ClientLayout = () => {

  const {isLoading} = useLoading()
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Header />

      {/* Content on the right */}
      <div className="flex-1 p-4">
        {
          isLoading && <Spinner />
        }
        <Outlet /> {/* Render nested admin routes */}

        <Footer />
      </div>

    
    </div>
    
  );
};

export default ClientLayout;
