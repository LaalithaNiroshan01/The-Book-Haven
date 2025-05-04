import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [usersRes, booksRes, ordersRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/books"),
          api.get("/admin/orders"),
        ]);

        setUsers(usersRes.data);
        setBooks(booksRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/admin/books/${bookId}`);
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-section">
        <h3>Users ({users.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Books ({books.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.authors.join(", ")}</td>
                  <td>${book.price}</td>
                  <td>{book.stock}</td>
                  <td>
                    <button onClick={() => handleDeleteBook(book._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Orders ({orders.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.username}</td>
                  <td>${order.totalAmount}</td>
                  <td>{order.orderStatus}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
