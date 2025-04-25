
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Homepage";
// import Dashboard from "../pages/Dashboard";
// import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";
import AuthForm from "../components/Auth";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import Auth from "../pages/Auth";
import { ToastContainer } from "react-toastify";
import AdminLayout from "../layouts/AdminLayout";
import Product from "../pages/Product";
import Order from "../pages/Orders";
import AddProduct from "../pages/ProductForm";
import ProductList from "../pages/ProductList";
import ProductPage from "../pages/client/ProductPage";
import ClientLayout from "../layouts/ClientLayout";
import ProductDetailPage from "../pages/client/ProductDetailPage";
import CartPage from "../pages/client/CartPage";
import CheckoutPage from "../pages/client/CheckoutPage";
import OrderListPage from "../pages/OrderListPage";
import FailurePage from "../components/FailurePage";
import SuccessPage from "../components/SuccessPage";
import ClientDashboard from "../layouts/ClientDashboardLayout";
import UserProfile from "../pages/client/ProfilePage";
import ClientOrders from "../pages/client/ClientOrder";
import InventoryPage from "../pages/InventoryPage";


const AppRoutes = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/san-pham" element={<ProductPage />} /> */}



        <Route
          path="/"
          element={
            // <PrivateRoute>
            <ClientDashboard />
            // </PrivateRoute>
          }
        >
          <Route path="/profile" element={<UserProfile />} />

          <Route path="/orders" element={<ClientOrders />} />

        </Route>



        <Route
          path="/"
          element={
            // <PrivateRoute>
            <ClientLayout />
            // </PrivateRoute>
          }
        >
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/san-pham" element={<ProductPage />} />
          <Route path="failure" element={<FailurePage />} />

          <Route path="/success" element={<SuccessPage />} />

          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/product/detail/:product_id" element={<ProductDetailPage />} />
        </Route>




        {/* Protected Routes - Only accessible when authenticated */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="inventory" element={<InventoryPage />} />

          <Route path="products/list" element={<ProductList />} />

          <Route path="products" element={<Product />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="orders" element={<OrderListPage />} />
        </Route>
        {/* <Route
            element={
              <AuthProvider>
                <PrivateRoute />
              </AuthProvider>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
          </Route> */}


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>

  );
};

export default AppRoutes;