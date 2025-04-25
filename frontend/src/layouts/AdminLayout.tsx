

import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/SideBar";
import { useLoading } from "../hooks/useLoading";
import Spinner from "../components/Spinner";
import HeaderWithNotifications from "../components/admin/Header";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";


const AdminLayout = () => {

  const [notifications, setNotifications] = useState([]);
  const sellerId = localStorage.getItem("id")

  useEffect(() => {
    const fetchData = async () => {
      const notis = await axiosInstance.get(
        `/noti/list/${sellerId}`
      )
      setNotifications(notis.data.notifications); 

    };
    fetchData();
  }, []);



  const {isLoading} = useLoading()
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Content on the right */}
      <div className="flex-1 p-4">
        <HeaderWithNotifications notifications={notifications}/>
        {
          isLoading && <Spinner />
        }
        <Outlet /> {/* Render nested admin routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
