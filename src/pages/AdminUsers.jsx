import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="admin-card">
      <h3 className="admin-card-title mb-4">Registered Users</h3>
      <table className="table table-hover">
        <thead className="table-light">
          <tr><th>ID</th><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}