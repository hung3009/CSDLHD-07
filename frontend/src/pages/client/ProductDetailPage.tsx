import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../services/axiosInstance";
import { useLoading } from "../../hooks/useLoading";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../../hooks/useCart";
const ProductDetailPage = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
    const {setLoading, isLoading} = useLoading()
    const {fetchCart} = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/product/detail/${product_id}`);
        console.log("value res ", response);
        
        setProduct(response.data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  const handleAddToCart = async () => {
    setLoading(true)
    console.log("Added to cart:", product);
    const cartItem = {
        user_id: localStorage.getItem("id"), // Get user ID from local storage (or context)
        product_id: product.product_id, // Use the product's ID
        name: product.name,
        quantity: 1, // Assuming 1 item is added to the cart
        price: product.price, // Price of the product
        total_price: product.price * 1, // Calculate total price (quantity * price)
        image: product.images[0], // Assuming first image is the main image,
        seller_id: product.seller_id
      };
    
      try {
        const response = await axiosInstance.post("/cart/add", cartItem, {
          headers: {
            "Content-Type": "application/json", // Send as JSON
          },
        });
        console.log("Cart item added successfully:", response.data);
        toast.success("Add to cart successful");
        fetchCart();
        setLoading(false)
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
      finally {
        // toast.success("Login successful");

      }
  };


  return (
    <div className="flex flex-col md:flex-row p-20 bg-gray-100 min-h-screen">
      {/* Product Image */}
     <div className="w-full md:w-1/3 flex justify-center">
  {product?.images?.length ? (
    <img
      src={`http://localhost:5000/${product.images[0]}`}
      alt={product?.name || "Product Image"}
      className="w-64 h-64 object-cover rounded-lg shadow-md"
    />
  ) : (
    <div className="w-64 h-64 flex items-center justify-center bg-gray-200 rounded-lg shadow-md">
      No Image
    </div>
  )}
</div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 p-6">
        <h2 className="text-2xl font-bold text-gray-800">{product?.name}</h2>
        <p className="text-lg text-gray-600 mt-2">${product?.price}</p>

        <button
          onClick={handleAddToCart}
          className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
