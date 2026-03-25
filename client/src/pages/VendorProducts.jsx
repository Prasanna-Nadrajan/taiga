import { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '', image: '', stock: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products/vendor/me');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || '',
      image: product.image,
      stock: product.stock
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, form);
      } else {
        await API.post('/products', form);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await API.post('/categories', { name: newCategory });
      setNewCategory('');
      setShowCategoryForm(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="vendor-products-page">
      <div className="page-header">
        <h1 className="page-title">My Products</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Start adding products to your store</p>
        </div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} className="table-product-image" />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>₹{product.price?.toLocaleString()}</td>
                  <td>
                    <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => openEdit(product)}>
                        <FiEdit2 />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => deleteProduct(product._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                  rows={3}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <div className="category-select-row">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-sm" onClick={() => setShowCategoryForm(!showCategoryForm)}>
                    <FiPlus />
                  </button>
                </div>
                {showCategoryForm && (
                  <div className="inline-form">
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                    />
                    <button type="button" className="btn btn-sm btn-primary" onClick={addCategory}>Add</button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
