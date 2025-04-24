import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../services/axiosInstance";
import { Order } from "../OrderListPage";

const ClientOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/list/client", {
          params: { customer_id: localStorage.getItem("id") },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-20 mt-20">
      <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <th className="p-3">Order ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.order_id}
                className="border-t text-sm hover:bg-gray-50"
              >
                <td className="p-3">{order.order_id}</td>
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.phone}</td>
                <td className="p-3">{order.address}</td>
                <td className="p-3">{order.payment_method}</td>
                <td className="p-3 capitalize">{order.status}</td>
                <td className="p-3">{order.total_amount}</td>
                <td className="p-3">
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientOrders;
