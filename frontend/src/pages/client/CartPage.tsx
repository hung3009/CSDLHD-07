import { CheckCircle, MinusCircleIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";


const CartPage = () => {
  const { cartItems } = useCart(); // Get cart data from Context
  const navigate = useNavigate()

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    try {
      await axiosInstance.put(`/cart/update/${itemId}`, { quantity: newQuantity });
    //   fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await axiosInstance.delete(`/cart/remove/${itemId}`);
    //   fetchCart(); // Refresh cart after deletion
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="p-20">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item._id} className="flex items-center justify-between p-4 border rounded-lg shadow-md">
            {/* Product Image */}
            <img
              src={`http://localhost:5000/${item.image}`}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md"
            />

            {/* Product Details */}
            <div className="flex-1 ml-10">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-500">Quantity: {item.quantity}</p>
              <p className="text-gray-700 font-semibold">{item.total_price.toFixed(2)} VND</p>
            </div>

            {/* Quantity Controls (Plus & Minus) */}
            <div className="flex flex-col items-center">
              <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="p-1 text-blue-600 hover:text-blue-800">
                <PlusCircleIcon size={18} />
              </button>
              <span className="text-lg font-medium">{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="p-1 text-red-600 hover:text-red-800">
                <MinusCircleIcon size={18} />
              </button>
            </div>

            {/* Delete Button */}
            <button onClick={() => handleRemoveItem(item._id)} className="p-2 text-gray-600 hover:text-red-600">
              <Trash2Icon size={20} />
            </button>
          </li>
        ))}
      </ul>
      )}
    
<button
            type="submit"
            onClick={() =>  navigate("/thanh-toan")}
            className="mt-10 w-40 bg-blue-600 text-white py-2 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <CheckCircle className="w-5 h-5" /> Checkout
          </button>
    </div>
  );
};

export default CartPage;
