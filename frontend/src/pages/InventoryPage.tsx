import React, { useState, useEffect } from 'react';
import InventoryImportForm from '../components/admin/ImportProduct';
import { useLoading } from '../hooks/useLoading';
import axiosInstance from '../services/axiosInstance';


const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false); // 👈 toggle form

  const storedId = localStorage.getItem("id") as string;
  

  const fetchInventory = async () => {
    try {
      const res = await axiosInstance.get('/inventory/list', {
        params: {
          seller_id: storedId, // 👈 make sure sellerId is defined
        },
      });
      setInventory(res.data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };
  

  useEffect(() => {

    fetchInventory()
  }, [])

 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Kho hàng</h1>

      <InventoryImportForm  />

      <table className="mt-6 w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Seller ID</th>
            <th className="p-2 border">Product ID</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Restock Threshold</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2 border">{item.seller_id}</td>
              <td className="p-2 border">{item.product_id}</td>
              <td className="p-2 border">{item.stock}</td>
              <td className="p-2 border">{item.restock_threshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
