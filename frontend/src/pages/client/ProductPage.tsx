import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { useLoading } from "../../hooks/useLoading";

const limit = 10; // Number of products per page

const ProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { setLoading} = useLoading()

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (pageNumber: number) => {
    try {
        setLoading(true)
      const response = await axiosInstance.get(
        `http://localhost:5001/api/product/list?page=${pageNumber}&limit=${limit}`
      );
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / limit));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Products</h2>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.product_id} className="bg-white shadow-md rounded-lg p-4">
            <Link to={`/product/${product.product_id}`}>
              <img
                src={`http://localhost:5001/${product.images?.[0]}`} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </Link>
            <h3 className="text-lg font-semibold mt-2">
  <Link
    to={`/product/detail/${product.product_id}`}
    className="text-blue-500 no-underline hover:no-underline"
  >
    {product.name}
  </Link>
</h3>
            <p className="text-gray-600 text-sm">{product.price} VND</p>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center hover:bg-blue-700">
              <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-full ${currentPage === 1 ? "text-gray-400" : "text-black hover:bg-gray-200"}`}
        >
          <ChevronLeft />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPage === page ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-full ${currentPage === totalPages ? "text-gray-400" : "text-black hover:bg-gray-200"}`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
