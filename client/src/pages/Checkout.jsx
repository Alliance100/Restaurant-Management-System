import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Tag, CheckCircle, ArrowLeft, Loader2, Clock, Package, Trash2, Plus, Minus } from 'lucide-react';
import { selectCartItems, selectCartSubtotal, clearCart, updateQuantity, removeFromCart } from '../store/cartSlice';
import api from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const DELIVERY_FEE = 200; // in cents ($2.00)

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const { user } = useSelector((s) => s.auth);

  const [address, setAddress] = useState({
    label: user?.addresses?.[0]?.label || 'Home',
    line1: user?.addresses?.[0]?.line1 || '',
    city: user?.addresses?.[0]?.city || 'Lahore',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    instructions: user?.addresses?.[0]?.instructions || '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [clientSecret, setClientSecret] = useState('');
  const [stripeOrderId, setStripeOrderId] = useState(null);

  if (items.length === 0 && !placedOrder && !stripeOrderId) {
    return (
    <PageTransition>
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-none border border-stone-200 dark:border-stone-800 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-10 h-10 text-stone-300 dark:text-stone-600" />
          </div>
          <h1 className="text-xl font-black text-stone-800 dark:text-stone-100 mb-2">Your cart is empty</h1>
          <p className="text-sm text-stone-400 mb-6">Add some items from the menu before checking out.</p>
          <Link to="/menu" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-sm font-bold text-sm transition-all">
            Browse Menu
          </Link>
        </div>
      </div>
    </PageTransition>
    );
  }

  if (placedOrder) {
    return (
      <PageTransition>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center px-4 py-10">
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800  border border-stone-100 dark:border-stone-800 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-none border border-stone-200 dark:border-stone-800 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-2">Order Placed! 🎉</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-1">
            Your order number is:
          </p>
          <div className="text-lg font-black text-orange-600 dark:text-orange-400 mb-6 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-sm inline-block">
            {placedOrder.orderNumber}
          </div>

          <div className="mb-6 text-left bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-none border border-stone-200 dark:border-stone-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-amber-500 rounded-sm animate-pulse" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Waiting for Approval</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Your order has been received. The restaurant will confirm it shortly. You can track your order status in "My Orders".
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/my-orders"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-none border border-stone-200 dark:border-stone-800 transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" /> Track My Order
            </Link>
            <Link
              to="/menu"
              className="w-full border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold py-3 rounded-none border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      </PageTransition>
    );
  }

  const discountAmount = coupon?.discountAmount || 0;
  const total = subtotal + DELIVERY_FEE - discountAmount;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCoupon(null);
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, orderSubtotal: subtotal });
      setCoupon(res.data.data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.line1.trim()) { setError('Please enter a delivery address'); return; }
    setPlacing(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        selectedAddOns: item.selectedAddOns.map((a) => ({ _id: a._id, name: a.name, price: a.price })),
      }));

      const res = await api.post('/orders', {
        items: orderItems,
        deliveryAddress: address,
        couponCode: coupon ? couponCode : undefined,
        paymentMethod: paymentMethod,
        notes,
      });

      const newOrder = res.data.data;

      if (paymentMethod === 'stripe') {
        const intentRes = await api.post('/payments/create-intent', { orderId: newOrder._id });
        setClientSecret(intentRes.data.data.clientSecret);
        setStripeOrderId(newOrder);
      } else {
        dispatch(clearCart());
        setPlacedOrder(newOrder);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (clientSecret && stripeOrderId) {
    const options = {
      clientSecret,
      appearance: { theme: 'stripe' },
    };
    return (
      <PageTransition>
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center px-4 py-10">
          <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-6 text-center">Complete Payment</h2>
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm 
                order={stripeOrderId} 
                onPaymentSuccess={(order) => {
                  setPlacedOrder(order);
                  setClientSecret('');
                  setStripeOrderId(null);
                }} 
              />
            </Elements>
            <button 
              onClick={() => {
                setClientSecret('');
                setStripeOrderId(null);
              }}
              className="mt-4 w-full text-sm font-semibold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-10 px-4 transition-colors duration-200">
      <div className="container mx-auto max-w-5xl">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">Checkout</h1>
            <p className="text-sm text-stone-400">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            <div className="lg:col-span-3 space-y-6">

              <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800 ">
                <h2 className="text-base font-black text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-5">
                  <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Delivery Address
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Label</label>
                      <select value={address.label} onChange={(e) => setAddress({ ...address, label: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Home</option><option>Work</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">City</label>
                      <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Street Address *</label>
                    <input type="text" required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      placeholder="House/Flat number, Street, Area"
                      className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-stone-400" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Postal Code</label>
                    <input type="text" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="54000"
                      className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-stone-400" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">Delivery Instructions (optional)</label>
                    <input type="text" value={address.instructions} onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                      placeholder="Ring the bell, leave at gate, etc."
                      className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-stone-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800 ">
                <h2 className="text-base font-black text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-4">
                  💳 Payment Method
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`cursor-pointer flex items-center gap-4 px-4 py-3 rounded-sm border-2 transition-all ${paymentMethod === 'cash_on_delivery' ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/30' : 'border-stone-200 dark:border-stone-700 hover:border-orange-200 dark:hover:border-orange-800'}`}
                  >
                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cash_on_delivery' ? 'bg-orange-600' : 'bg-stone-200 dark:bg-stone-700'}`}>
                      <span className="text-white text-lg">💵</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Cash on Delivery</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">Pay when it arrives</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('stripe')}
                    className={`cursor-pointer flex items-center gap-4 px-4 py-3 rounded-sm border-2 transition-all ${paymentMethod === 'stripe' ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/30' : 'border-stone-200 dark:border-stone-700 hover:border-orange-200 dark:hover:border-orange-800'}`}
                  >
                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${paymentMethod === 'stripe' ? 'bg-orange-600' : 'bg-stone-200 dark:bg-stone-700'}`}>
                      <span className="text-white text-lg">💳</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-800 dark:text-stone-100">Pay Online</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">Secure card payment</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800 ">
                <h2 className="text-base font-black text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-amber-500" /> Coupon Code
                </h2>
                {coupon ? (
                  <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-sm">
                    <div>
                      <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{coupon.code} applied! 🎉</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-500">
                        - ${(coupon.discountAmount / 100).toFixed(2)} discount
                      </div>
                    </div>
                    <button type="button" onClick={() => { setCoupon(null); setCouponCode(''); }}
                      className="text-xs text-stone-400 hover:text-red-500 font-semibold transition-colors">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400 uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleValidateCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-bold text-sm rounded-sm transition-all"
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800 ">
                <h2 className="text-base font-black text-stone-800 dark:text-stone-100 mb-4">📝 Special Instructions</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special requests for the kitchen? (e.g. no onions, extra spicy…)"
                  className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-stone-400 resize-none"
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800  sticky top-20">
                <h2 className="text-base font-black text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-5">
                  <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Order Summary
                </h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => {
                    const addOnsTotal = item.selectedAddOns.reduce((s, a) => s + a.price, 0);
                    const lineTotal = (item.basePrice + addOnsTotal) * item.quantity;
                    return (
                      <div key={item.cartId} className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 dark:bg-stone-800">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">?</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate">{item.name}</p>
                          {item.selectedAddOns.length > 0 && (
                            <p className="text-[10px] text-stone-400 truncate">+ {item.selectedAddOns.map(a => a.name).join(', ')}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-sm border border-stone-200 dark:border-stone-700">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    dispatch(updateQuantity({ cartId: item.cartId, quantity: item.quantity - 1 }));
                                  } else {
                                    dispatch(removeFromCart(item.cartId));
                                  }
                                }}
                                className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-orange-600 font-bold"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-[10px] font-bold text-stone-800 dark:text-stone-200">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => dispatch(updateQuantity({ cartId: item.cartId, quantity: item.quantity + 1 }))}
                                className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-orange-600 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex-shrink-0">${(lineTotal / 100).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                    <span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                    <span>Delivery fee</span><span>${(DELIVERY_FEE / 100).toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Coupon discount</span><span>- ${(discountAmount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-base text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-100 dark:border-stone-800 mt-2">
                    <span>Total</span><span>${(total / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-stone-400 bg-stone-50 dark:bg-stone-800 rounded-sm px-3 py-2">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Estimated delivery: <strong className="text-stone-700 dark:text-stone-300">30–45 minutes</strong></span>
                </div>

                {error && (
                  <div className="mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm text-xs text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={placing}
                  className="mt-5 w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-70 text-white font-bold py-3.5 rounded-none border border-stone-200 dark:border-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 dark:shadow-none active:scale-95"
                >
                  {placing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <>{paymentMethod === 'stripe' ? 'Continue to Payment' : 'Place Order'} · ${(total / 100).toFixed(2)}</>
                  )}
                </button>

                <p className="text-center text-xs text-stone-400 mt-3">
                  By placing this order you agree to our{' '}
                  <span className="text-orange-500 cursor-pointer hover:underline">Terms of Service</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
      </PageTransition>

    );
};

export default Checkout;
