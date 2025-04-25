import { Outlet } from "react-router-dom";
import { useLoading } from "../hooks/useLoading";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import UserSidebar from "../components/client/SideBar";
import Footer from "../components/client/Footer";


const ClientDashboard = () => {

  const {isLoading} = useLoading()
  return (
    <div className="">
      {/* Sidebar on the left */}
      <Header />



      {/* Content on the right */}
      <div className="flex flex-row p-4">
        {
          isLoading && <Spinner />
        }
        {/* side bar */}
        <UserSidebar />

        {/* content main  */}
        <Outlet /> {/* Render nested admin routes */}
      </div>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
