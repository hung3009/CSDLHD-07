import { useState } from "react";
import { ChevronDown, Box, ShoppingCart, List, Plus, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    products: false,
    orders: false,
    inventory: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold text-center">Admin Panel</h2>

      <nav className="mt-6 space-y-2">
        {/* Products Menu */}
        <div>
          <button
            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-800 rounded"
            onClick={() => toggleMenu("products")}
          >
            <span className="flex items-center gap-2">
              <Box className="w-5 h-5" />
              Products
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openMenus.products ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.products && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                to="/admin/products/list"
                className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                  location.pathname === "/admin/products" ? "bg-gray-700" : ""
                }`}
              >
                <List className="w-4 h-4 inline-block mr-2" />
                Product List
              </Link>
              <Link
                to="/admin/products/add"
                className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                  location.pathname === "/admin/products/add" ? "bg-gray-700" : ""
                }`}
              >
                <Plus className="w-4 h-4 inline-block mr-2" />
                Add Product
              </Link>
            </div>
          )}
        </div>

        {/* Orders Menu */}
        <div>
          <button
            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-800 rounded"
            onClick={() => toggleMenu("inventory")}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Orders
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openMenus.orders ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.inventory && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                to="/admin/orders"
                className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                  location.pathname === "/admin/orders" ? "bg-gray-700" : ""
                }`}
              >
                <List className="w-4 h-4 inline-block mr-2" />
                Manage Orders
              </Link>
            </div>
          )}
        </div>
        {/* inventory  */}
        <div>
          <button
            className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-800 rounded"
            onClick={() => toggleMenu("orders")}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Inventory
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openMenus.orders ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.orders && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                to="/admin/inventory"
                className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                  location.pathname === "/admin/inventory" ? "bg-gray-700" : ""
                }`}
              >
                <List className="w-4 h-4 inline-block mr-2" />
                Manage inventory
              </Link>
            </div>
          )}
        </div>

        {/* Logout */}
        <button className="w-full flex items-center px-4 py-2 hover:bg-gray-800 rounded mt-4">
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
