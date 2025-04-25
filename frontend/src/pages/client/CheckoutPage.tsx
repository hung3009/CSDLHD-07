import { ChangeEvent, FormEvent, useState } from "react";
import { ShoppingCart, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import axiosInstance from "../../services/axiosInstance";
import { useLoading } from "../../hooks/useLoading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
  });
  const [errors, setErrors] = useState({ name: "", address: "", phone: "" });
  const {cartItems} = useCart();
  const {setLoading} = useLoading()
  const navigate = useNavigate();
  
//   const cartItems = [
//     { id: 1, name: "Product 1", price: 200000, quantity: 2, image: "/images/product1.jpg" },
//     { id: 2, name: "Product 2", price: 150010, quantity: 1, image: "/images/product2.jpg" },
//   ];

  const validateForm = () => {
    let newErrors = { name: "", address: "", phone: "" };
    if (!form.name) newErrors.name = "Name is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.phone || !/^\(\+84|0\)[1-9]\d{8}$/.test(form.phone)) {
      newErrors.phone = "Valid phone number is required";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // if (!validateForm()) return;
    console.log("Order placed:", form);


    const response = await axiosInstance.post("/create-payment/", {
      ...form,
      cartItems,
      customer_id: localStorage.getItem("id")

    });

    if (form.paymentMethod === "cod") {
      toast.success("Đặt hàng thành công!");
      navigate("/");
    } else if (form.paymentMethod === "vnpay")
      console.log("url vnpay ", response);
        
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Redirect to VNPAY
      }
    }
     
    setLoading(false);
    



  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-20 p-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
        <ShoppingCart className="w-6 h-6" /> Checkout
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Address Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              name="address"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={form.address}
              onChange={handleInputChange}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={form.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
        </form>

        {/* Right Column - Product Overview & Payment Method */}
        <div className="space-y-4">
          {/* Product Overview */}
          <div className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center border-b pb-3 mb-3">
                <img src={`http://localhost:5001/${item.image}`} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div className="ml-4 flex-1">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-gray-700 font-semibold">{(item.price * item.quantity).toLocaleString()} VND</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === "cod"}
                  onChange={handleInputChange}
                />
                <Truck className="w-5 h-5" /> Cash on Delivery (COD)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  checked={form.paymentMethod === "vnpay"}
                  onChange={handleInputChange}
                />
                <CreditCard className="w-5 h-5" /> Online Payment (VNPAY)
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <CheckCircle className="w-5 h-5" /> Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
