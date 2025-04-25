import { FormEvent, useState } from "react";
import { useLoading } from "../hooks/useLoading";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    status: "active",
    description : "",
    subImages: [] as File[],
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { setLoading } = useLoading();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "primaryImage" | "subImages") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFormData(prev => ({
      ...prev,
      [field]: field === "primaryImage" ? files[0] : Array.from(files),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Ngăn chặn reload trang
    console.log("Submitting Product:", formData);

    // const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


    setLoading(true);
    
    const seller_id = localStorage.getItem("id");

    if(!seller_id){
      navigate("/auth")
      return 
    }
    const data = new FormData(); // Change variable name to avoid confusion
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("status", formData.status);
    data.append("description", formData.description);
    data.append("seller_id", seller_id);

    formData.subImages.forEach((file) => {
      data.append("images", file); // Must match `upload.array("images")` on backend
    });
    
    // await sleep(15001);
    const response = await axiosInstance.post("/product/add", data
      ,{headers: { "Content-Type": "multipart/form-data" }}
    );
    

    console.log("response add product ", response);

    setLoading(false);

    if (response.status === 201) {
      toast.success("Add product successful");
      navigate("/admin/products")
    }
    
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Add Product</h2>

      <form className="space-y-4" onSubmit={handleSubmit}  method="POST">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Product Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product title"
          />
        </div>


        <div>
        <label className="block text-gray-700 font-medium mb-1" htmlFor="description">Description</label>
        <input 
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          
        />
      </div>




        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Stock</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter stock"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

       

        {/* Sub Images Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Images</label>
          <div 
            className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer"
            onClick={() => document.getElementById("subImagesUpload")?.click()}
          >
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={(e) => handleFileChange(e, "subImages")} 
              id="subImagesUpload"
            />
            <span className="text-gray-500">Click to upload sub images</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.subImages.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt={`Sub-${index}`} className="w-20 h-20 object-cover rounded-md" />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
