import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/api";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./Payment.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      const res = await api.post(`/payment/${orderId}`, {
        paymentMethodId: paymentMethod.id,
        amount: amount * 100, // Convert to cents
      });

      if (res.data.success) {
        navigate(`/order-confirmation/${orderId}`);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button
        type="submit"
        className="pay-button"
        disabled={!stripe || processing}
      >
        {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Order ID: {order._id}</p>
        <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm orderId={orderId} amount={order.totalAmount} />
      </Elements>
    </div>
  );
};

export default Payment;
