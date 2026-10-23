import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = () => {
    api.get('/categories').then(res => setCategories(res.data));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name });
      } else {
        await api.post('/categories', { name });
      }
      setShowModal(false);
      setName('');
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="admin-card">
      <div className="d-flex justify-content-between mb-4">
        <h3 className="admin-card-title mb-0">Manage Categories</h3>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setName(''); setShowModal(true); }}>+ Add Category</button>
      </div>
      
      <table className="table table-hover">
        <thead className="table-light">
          <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditId(c.id); setName(c.name); setShowModal(true); }}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">{editId ? 'Edit' : 'Add'} Category</h5></div>
              <div className="modal-body">
                <form onSubmit={handleSave}>
                  <input type="text" className="form-control mb-3" placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} required />
                  <button type="submit" className="btn btn-primary w-100">Save</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}