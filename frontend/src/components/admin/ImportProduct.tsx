import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axiosInstance from '../../services/axiosInstance';
import { useLoading } from '../../hooks/useLoading';
import { useNavigate } from 'react-router-dom';

type InventoryFormData = {
  seller_id: string ;
  product_id: string;
  stock: string;
  restock_threshold: string;
};

type InventoryImportFormProps = {
//   onImport: () => void;
};

const InventoryImportForm: React.FC<InventoryImportFormProps> = ({ }) => {
  const [formData, setFormData] = useState<InventoryFormData>({
    seller_id: '',
    product_id: '',
    stock: '',
    restock_threshold: '',
  });

  const [isOpen, setIsOpen] = useState(false);

   const [limit] = useState(10);
    const [products, setProducts] = useState<any[]>([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { setLoading} = useLoading()

    const [totalPages, setTotalPages] = useState(1);

    const [sellerId, setSellerId] = useState<string>('');

    useEffect(() => {
        const storedId = localStorage.getItem("id") as string;
        setSellerId(storedId);
        console.log("seller id", storedId);
        setFormData({...formData, seller_id: storedId})
      }, []);


    const fetchProducts = async () => {
      try {
          setLoading(true)
        const response =  await axiosInstance.get(
          `/product/list?limit=${limit}`
        );
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / limit));
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    useEffect(() => {
      
      
        fetchProducts();
      }, []);
  

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await axiosInstance.post('/inventory/add', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
    if (response.status) {
      
      alert('Thêm hàng thành công!');
      setIsOpen(false); // Close the modal after successful submission
      navigate('/admin/inventory')

    } else {
      alert('Lỗi khi nhập kho.');
    }
  };

  return (
    <>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setIsOpen(true)}>
        + Nhập kho
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Nhập kho mới"
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-[20vh] shadow-lg"
        overlayClassName="bg-black/40 fixed inset-0"
      >
        <h2 className="text-xl font-bold mb-4">Nhập kho mới</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            name="seller_id"
            placeholder="Seller ID"
            className="border p-2"
            
            hidden={true}
            value={sellerId ?? ''}
            // onChange={handleChange}
          />
       <select
  name="product_id"
  className="border p-2"
  required
  value={formData.product_id}
  onChange={handleChange}
>
  <option value="" disabled>Chọn sản phẩm</option>
  {products.map(product => (
    <option key={product.id} value={product.product_id}>
      {product.name} {/* Adjust according to actual product fields */}
    </option>
  ))}
</select>
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            className="border p-2"
            required
            onChange={handleChange}
          />
          <input
            name="restock_threshold"
            type="number"
            placeholder="Restock Threshold"
            className="border p-2"
            required
            onChange={handleChange}
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Nhập
          </button>
        </form>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-3 text-xl"
        >
          ×
        </button>
      </Modal>
    </>
  );
};

export default InventoryImportForm;
