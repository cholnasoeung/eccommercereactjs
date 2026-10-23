import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaBox, FaUsers, FaExclamationTriangle, FaPlus, FaChartLine } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch all necessary data concurrently
    Promise.all([
      api.get('/admin/orders'),
      api.get('/products?size=100'),
      api.get('/admin/users')
    ])
      .then(([ordersRes, productsRes, usersRes]) => {
        setOrders(ordersRes.data);
        setProducts(productsRes.data.content);
        setUsers(usersRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Access Denied: You must be logged in as an Admin.');
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
      // Update local state without refetching everything
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
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

  // --- CALCULATE STATISTICS ---
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStockProducts = products.filter(p => p.stockQuantity < 5);

  // Calculate Chart Data (Last 7 Days)
  const chartDataMap = {};
  orders.forEach(order => {
    const date = new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    chartDataMap[date] = (chartDataMap[date] || 0) + order.totalAmount;
  });
  const chartData = Object.keys(chartDataMap).map(date => ({
    date,
    revenue: chartDataMap[date]
  })).slice(-7); // Get last 7 active days

  if (loading) return <div className="text-center mt-5"><h3>Loading Dashboard...</h3></div>;
  if (error) return <div className="text-center mt-5"><h2 className="text-danger">{error}</h2></div>;

  return (
    <>
      <div className="welcome-banner d-flex justify-content-between align-items-center">
        <div>
          <h1>Welcome Back, Admin! 👋</h1>
          <p>Here is what's happening with your store today.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/products" className="btn btn-light fw-bold text-primary d-flex align-items-center gap-2">
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
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
        <div className="col-md-3">
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
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e2fff3', color: '#1bc5bd' }}>
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{users.length}</h3>
              <p>Total Customers</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#ffe2e5', color: '#f64e60' }}>
              <FaExclamationTriangle />
            </div>
            <div className="stat-info">
              <h3>{lowStockProducts.length}</h3>
              <p>Low Stock Alerts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* REVENUE CHART */}
        <div className="col-lg-8">
          <div className="admin-card h-100">
            <h3 className="admin-card-title d-flex align-items-center gap-2">
              <FaChartLine color="#3699ff" /> Revenue Overview
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3699ff" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3699ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#3699ff" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  No revenue data yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOW STOCK ALERTS */}
        <div className="col-lg-4">
          <div className="admin-card h-100">
            <h3 className="admin-card-title text-danger d-flex align-items-center gap-2">
              <FaExclamationTriangle /> Low Stock Alerts
            </h3>
            <div className="d-flex flex-column gap-3 mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {lowStockProducts.length === 0 ? (
                <p className="text-muted">All products are well stocked!</p>
              ) : (
                lowStockProducts.map(p => (
                  <div key={p.id} className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <div className="d-flex align-items-center gap-2">
                      {p.imageUrl ? (
                        <img src={`http://localhost:8080${p.imageUrl}`} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '5px' }}></div>
                      )}
                      <span className="fw-bold">{p.name}</span>
                    </div>
                    <span className="badge bg-danger">Only {p.stockQuantity} left</span>
                  </div>
                ))
              )}
            </div>
            {lowStockProducts.length > 0 && (
              <Link to="/admin/products" className="btn btn-sm btn-outline-danger w-100 mt-3">
                Restock Products
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="admin-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="admin-card-title mb-0">Recent Orders</h3>
        </div>
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
              {orders.slice(0, 5).map(order => (
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
                    <tr><th>Product</th><th>Qty</th><th>Price</th></tr>
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