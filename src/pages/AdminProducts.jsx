import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // If null, we are adding. If an ID, we are editing.
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('1'); // Default category
  const [image, setImage] = useState(null);

  const fetchProducts = () => {
    api.get('/products?size=100')
      .then(res => {
        setProducts(res.data.content);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    // 1. Prepare product data
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      categoryId: categoryId ? parseInt(categoryId) : null
    };

    try {
      let savedProductId = editId;

      // 2. If editing, send PUT. If adding, send POST.
      if (editId) {
        await api.put(`/products/${editId}`, productData);
      } else {
        const response = await api.post('/products', productData);
        savedProductId = response.data.id;
      }

      // 3. If an image was selected, upload it
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        
        await api.post(`/products/${savedProductId}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert(`✅ Product ${editId ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      resetForm();
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error(error);
      alert('❌ Failed to save product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('❌ Failed to delete product.');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price);
    setStockQuantity(product.stockQuantity);
    setCategoryId(product.categoryId || ''); // Handle if category is null
    setImage(null); // Reset image so we don't accidentally overwrite unless user selects a new one
    setShowModal(true);
  };

  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setEditId(null);
    setName(''); 
    setDescription(''); 
    setPrice(''); 
    setStockQuantity(''); 
    setCategoryId('1'); 
    setImage(null);
  };

  if (loading) return <div className="container mt-5"><h3>Loading Products...</h3></div>;

  return (
    <>
      <div className="admin-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="admin-card-title mb-0">Manage Products</h3>
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Add New Product
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img 
                        src={`http://localhost:8080${p.imageUrl}`} 
                        alt={p.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                      />
                    ) : (
                      <span className="badge bg-secondary">No Img</span>
                    )}
                  </td>
                  <td className="fw-bold">{p.name}</td>
                  <td className="text-warning fw-bold">${p.price.toFixed(2)}</td>
                  <td>{p.stockQuantity}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2" 
                      onClick={() => handleEditClick(p)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bootstrap Modal for Adding/Editing Products */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editId ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveProduct}>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label className="form-label fw-semibold">Product Name</label>
                      <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Category ID</label>
                      <input type="number" className="form-control" value={categoryId} onChange={e => setCategoryId(e.target.value)} placeholder="e.g. 1" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows="3"></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Price ($)</label>
                      <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Stock Quantity</label>
                      <input type="number" className="form-control" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} required />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Product Image {editId && <span className="text-muted fw-normal">(Leave blank to keep current image)</span>}
                    </label>
                    <input type="file" className="form-control" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                      {editId ? 'Update Product' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}