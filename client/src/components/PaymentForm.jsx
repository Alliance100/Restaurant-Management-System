import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';

const PaymentForm = ({ order, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We will just redirect to a success url or handle it without redirect if possible.
        // `redirect: 'if_required'` allows us to handle success inline for simple card payments.
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      onPaymentError && onPaymentError(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      dispatch(clearCart());
      onPaymentSuccess && onPaymentSuccess(order);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement className="mb-6" />
      
      {message && <div className="text-red-500 text-sm mb-4">{message}</div>}
      
      <button
        disabled={loading || !stripe || !elements}
        className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-none transition-all flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : `Pay $${(order.total / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
