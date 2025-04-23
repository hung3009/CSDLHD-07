
import React from "react";
import { Link } from "react-router-dom";

const UserSidebar = () => {
  return (
    <div className="w-64 bg-gray-100 mt-10 h-screen shadow-md">
      <h2 className="text-xl font-semibold mb-6">User Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/profile"
            className="block px-4 py-2 rounded hover:bg-gray-200"
          >
            Information
          </Link>
        </li>
        <li>
          <Link
            to="/orders"
            className="block px-4 py-2 rounded hover:bg-gray-200"
          >
            Orders
          </Link>
        </li>
        <li>
          <button
            onClick={() => {
              // Add logout logic here
              console.log("Logging out...");
            }}
            className="block w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
