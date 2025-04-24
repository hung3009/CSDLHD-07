// OrderListPage.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useLoading } from "../hooks/useLoading";
// import { useHistory } from "react-router-dom";

export interface Order {
    order_id: string; // or UUID if you prefer UUID type
    customer_id: string; // or UUID if you prefer UUID type
    total_amount: number;
    payment_method: string;
    status: string;
    address: string;
    phone: string;
    name: string;
    created_at: string; // timestamp or string representing date
  }


const OrderListPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
//   const history = useHistory();
  const sellerId = localStorage.getItem("id")
  const {isLoading, setLoading} = useLoading()

  // Fetch orders from the API
  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/orders/list?sellerId=${sellerId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    setLoading(false);
  }, [sellerId]);

  // Navigate to the order details page
//   const handleOrderClick = (orderId: any) => {
//     history.push(`/order-detail/${orderId}`);
//   };

  return (
    <div className="order-list-page">
    <h1>Order List</h1>
    {isLoading ? (
      <p>Loading...</p>
    ) : orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-300 shadow rounded">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Customer ID</th>
            <th className="py-2 px-4 border-b">Total Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id} className="text-center">
              <td className="py-2 px-4 border-b">{order.order_id}</td>
              <td className="py-2 px-4 border-b">{order.customer_id}</td>
              <td className="py-2 px-4 border-b">{order.total_amount}</td>
              <td className="py-2 px-4 border-b capitalize">{order.status}</td>
              <td className="py-2 px-4 border-b capitalize">{order.payment_method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
  </div>
  );
};

export default OrderListPage;
