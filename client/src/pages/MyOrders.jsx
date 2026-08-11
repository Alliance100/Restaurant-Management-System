import React from 'react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, ChefHat, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/axios';

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: 'Waiting for Approval',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    pulse: true,
  },
  confirmed: {
    label: 'Order Confirmed',
    icon: CheckCircle,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
    pulse: false,
  },
  preparing: {
    label: 'Being Prepared',
    icon: ChefHat,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    pulse: true,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    icon: Truck,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    pulse: true,
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    pulse: false,
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-stone-500 dark:text-stone-500',
    bg: 'bg-stone-50 dark:bg-stone-800',
    border: 'border-stone-200 dark:border-stone-700',
    dot: 'bg-stone-400',
    pulse: false,
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    pulse: false,
  },
};

// Status progress steps (for tracking bar)
const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-sm ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  );
};

const ProgressTracker = ({ status }) => {
  if (['cancelled', 'rejected'].includes(status)) return null;
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className={`h-1.5 flex-1 rounded-sm transition-all duration-500 ${
              done
                ? active ? 'bg-orange-600 animate-pulse' : 'bg-orange-600'
                : 'bg-stone-200 dark:bg-stone-700'
            }`} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const OrderCard = ({ order, onCancel, cancelling }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <div className={`bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 border  transition-all ${cfg.border}`}>
      {/* Card header */}
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2.5 py-0.5 rounded-sm">
                {order.orderNumber}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-stone-400 mt-1">
              {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              ${(order.total / 100).toFixed(2)}
            </div>
            <div className="text-xs text-stone-400">
              {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <ProgressTracker status={order.status} />

        {/* Status-specific message */}
        {order.status === 'pending' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Waiting for restaurant to approve your order…</span>
          </div>
        )}
        {order.status === 'confirmed' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Your order has been approved! Kitchen will start preparing soon.</span>
          </div>
        )}
        {order.status === 'preparing' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Our chefs are preparing your meal. Estimated: {order.estimatedDeliveryMinutes} mins.</span>
          </div>
        )}
        {order.status === 'out_for_delivery' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
            <Truck className="w-3.5 h-3.5" />
            <span>Your order is on its way! Please be ready to receive it.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Hide' : 'View'} items
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() => onCancel(order._id)}
              disabled={cancelling === order._id}
              className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              {cancelling === order._id ? 'Cancelling…' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 dark:bg-stone-800">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">?</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-800 dark:text-stone-100">{item.name}</p>
                {item.addOns?.length > 0 && (
                  <p className="text-xs text-stone-400">+ {item.addOns.map(a => a.name).join(', ')}</p>
                )}
                <p className="text-xs text-stone-400">×{item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-stone-700 dark:text-stone-300">${(item.lineTotal / 100).toFixed(2)}</span>
            </div>
          ))}

          {/* Totals */}
          <div className="border-t border-stone-100 dark:border-stone-800 pt-3 space-y-1 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex justify-between"><span>Subtotal</span><span>${(order.subtotal / 100).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery fee</span><span>${(order.deliveryFee / 100).toFixed(2)}</span></div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Discount ({order.coupon?.code})</span><span>- ${(order.discountAmount / 100).toFixed(2)}</span></div>
            )}
            <div className="flex justify-between font-black text-sm text-stone-800 dark:text-stone-100 pt-1 border-t border-stone-100 dark:border-stone-800">
              <span>Total</span><span>${(order.total / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="bg-stone-50 dark:bg-stone-800 rounded-sm px-3 py-2.5 text-xs text-stone-500 dark:text-stone-400">
            📍 {order.deliveryAddress?.line1}, {order.deliveryAddress?.city}
          </div>

          {/* Status history */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Order Timeline</p>
            {[...order.statusHistory].reverse().map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <div className={`w-2 h-2 rounded-sm mt-0.5 flex-shrink-0 ${STATUS_CONFIG[h.status]?.dot || 'bg-stone-400'}`} />
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300 capitalize">
                    {STATUS_CONFIG[h.status]?.label || h.status}
                  </span>
                  {h.note && <span className="text-stone-400"> — {h.note}</span>}
                  <div className="text-stone-400">
                    {new Date(h.changedAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const fetchOrders = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchOrders(true); }, [fetchOrders]);

  // Auto-poll every 15 seconds if there are active orders
  useEffect(() => {
    const hasActiveOrders = orders.some(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status));
    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      fetchOrders(false);
      setLastRefresh(Date.now());
    }, 15000);

    return () => clearInterval(interval);
  }, [orders, fetchOrders]);

  const handleCancel = async (orderId) => {
    setCancelling(orderId);
    try {
      await api.patch(`/orders/my-orders/${orderId}/cancel`);
      fetchOrders(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancelling(null);
    }
  };

  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled', 'rejected'].includes(o.status));

  return (
    <PageTransition>
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-10 px-4 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">My Orders</h1>
            <p className="text-sm text-stone-400 mt-1">Track and manage your orders</p>
          </div>
          <button
            onClick={() => fetchOrders(false)}
            className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-3 py-2 rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-5 border border-stone-100 dark:border-stone-800">
                <div className="skeleton h-5 w-32 rounded mb-3 opacity-50" />
                <div className="skeleton h-4 w-48 rounded mb-2 opacity-50" />
                <div className="skeleton h-3 w-full rounded opacity-50" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-none border border-stone-200 dark:border-stone-800 flex items-center justify-center mx-auto mb-5">
              <Package className="w-10 h-10 text-stone-300 dark:text-stone-600" />
            </div>
            <h2 className="text-lg font-black text-stone-800 dark:text-stone-100 mb-2">No orders yet</h2>
            <p className="text-sm text-stone-400 mb-6">Looks like you haven't ordered anything yet. Let's fix that!</p>
            <Link to="/menu" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-sm font-bold text-sm transition-all">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-sm animate-pulse" />
                  <h2 className="text-sm font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    Active Orders ({activeOrders.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {activeOrders.map(order => (
                    <OrderCard key={order._id} order={order} onCancel={handleCancel} cancelling={cancelling} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-sm font-black text-stone-400 uppercase tracking-wider mb-4">Order History</h2>
                <div className="space-y-4">
                  {pastOrders.map(order => (
                    <OrderCard key={order._id} order={order} onCancel={handleCancel} cancelling={cancelling} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
      </PageTransition>

    );
};

export default MyOrders;
