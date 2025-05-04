import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get("/cart");
        setCart(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cart");
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleQuantityChange = async (bookId, newQuantity) => {
    try {
      await api.put(`/cart/${bookId}`, { quantity: newQuantity });
      setCart(
        cart.map((item) =>
          item.book._id === bookId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await api.delete(`/cart/${bookId}`);
      setCart(cart.filter((item) => item.book._id !== bookId));
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await api.post("/orders", { items: cart });
      navigate(`/payment/${res.data.orderId}`);
    } catch (err) {
      setError("Failed to create order");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {error && <div className="error-message">{error}</div>}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.book._id} className="cart-item">
                <img src={item.book.imageUrl} alt={item.book.title} />
                <div className="item-details">
                  <h3>{item.book.title}</h3>
                  <p>By {item.book.authors.join(", ")}</p>
                  <p>${item.book.price}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.book._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.book._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.book.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item.book._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
