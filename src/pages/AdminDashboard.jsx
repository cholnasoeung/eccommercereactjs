import { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaBox, FaUsers } from 'react-icons/fa';
import api from '../api/axios';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api.get('/admin/orders')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Access Denied: You must be logged in as an Admin.');
        setLoading(false);
      });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
      fetchOrders();
    } catch (err) {
      alert('❌ Failed to update status.');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'SHIPPED': return 'bg-info text-dark';
      case 'DELIVERED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  if (loading) return <h3>Loading Dashboard...</h3>;
  if (error) return <h2 className="text-danger">{error}</h2>;

  return (
    <>
      <div className="welcome-banner">
        <div>
          <h1>Welcome Back, Admin! 👋</h1>
          <p>Here is what's happening with your store today.</p>
        </div>
      </div>

      {/* STAT CARDS WITH ICONS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e1f0ff', color: '#3699ff' }}>
              <FaMoneyBillWave />
            </div>
            <div className="stat-info">
              <h3>${totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fff4de', color: '#ffb822' }}>
              <FaBox />
            </div>
            <div className="stat-info">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e2fff3', color: '#1bc5bd' }}>
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{new Set(orders.map(o => o.customerEmail)).size}</h3>
              <p>Total Customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Recent Orders</h3>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td className="fw-bold">#{order.orderId}</td>
                  <td>{order.customerEmail}</td>
                  <td className="text-warning fw-bold">${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => viewOrderDetails(order)}>
                      View Items
                    </button>
                    <select 
                      className="form-select form-select-sm d-inline-block w-auto"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Order #{selectedOrder.orderId} Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Customer:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                
                <table className="table table-sm mt-3">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <h5 className="text-end mt-3 text-warning fw-bold">
                  Total: ${selectedOrder.totalAmount.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}