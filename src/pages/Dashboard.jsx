import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { formatDate } from '../utils';
import productApi from '../services/productApi';

const Loader = () => <span className="loader">Loading...</span>;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const data = await productApi.fetchProducts(currentPage);
      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);
    if (mode === 'create') {
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
      });
    } else if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalMode === 'create') {
        await productApi.createProduct(formData);
        toast.success('Product created successfully');
      } else if (modalMode === 'edit') {
        await productApi.updateProduct(selectedProduct._id, formData);
        toast.success('Product updated successfully');
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Delete operation failed');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Products List</h1>
        <button onClick={() => openModal('create')} className="create-btn">
          Create New
        </button>
      </div>

      <table style={{height:"100vh"}} className="product-table">
        <thead>
          <tr>
            <th>Created At</th>
            <th>Name</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td>{formatDate(product?.createdAt)}</td>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>{product.price.toFixed(0)}</td>
              <td>
                <button onClick={() => openModal('edit', product)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => openModal('view', product)} className="view-btn">Show</button>
                <button onClick={() => handleDelete(product._id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          « Previous
        </button>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          Next »
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Product Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{modalMode.charAt(0).toUpperCase() + modalMode.slice(1)} Product</h2>
        <button onClick={closeModal} className="close-btn">×</button>
        {modalMode !== 'view' ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <Loader /> : (modalMode === 'create' ? 'Create' : 'Update')}
            </button>
          </form>
        ) : (
          <div className="product-details">
            <p><strong>Name:</strong> {selectedProduct?.name}</p>
            <p><strong>Price:</strong> {selectedProduct?.price}</p>
            <p><strong>Description:</strong> {selectedProduct?.description}</p>
            <p><strong>Category:</strong> {selectedProduct?.category}</p>
            <p><strong>Stock:</strong> {selectedProduct?.stock}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;