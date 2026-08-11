import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Truck, ChefHat, Package } from 'lucide-react';
import api from '../../api/axios';

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          color: 'text-amber-700 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-200 dark:border-amber-800',   dot: 'bg-amber-500'  },
  confirmed:        { label: 'Confirmed',        color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-500' },
  preparing:        { label: 'Preparing',        color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-blue-700 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-200 dark:border-blue-800',     dot: 'bg-blue-500'   },
  delivered:        { label: 'Delivered',        color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  cancelled:        { label: 'Cancelled',        color: 'text-stone-500',                        bg: 'bg-stone-50 dark:bg-stone-800',      border: 'border-stone-200 dark:border-stone-700',   dot: 'bg-stone-400'  },
  rejected:         { label: 'Rejected',         color: 'text-red-700 dark:text-red-400',        bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-200 dark:border-red-800',       dot: 'bg-red-500'    },
};

const VALID_NEXT = {
  pending:          ['confirmed', 'rejected'],
  confirmed:        ['preparing', 'cancelled'],
  preparing:        ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: [], cancelled: [], rejected: [],
};

const NEXT_LABELS = {
  confirmed:        { label: '✓ Approve Order',     cls: 'bg-orange-600 hover:bg-orange-500 text-white' },
  rejected:         { label: '✗ Reject Order',      cls: 'bg-red-600 hover:bg-red-500 text-white' },
  preparing:        { label: '🍳 Start Preparing',  cls: 'bg-amber-600 hover:bg-amber-500 text-white' },
  cancelled:        { label: '✗ Cancel',            cls: 'bg-stone-500 hover:bg-stone-400 text-white' },
  out_for_delivery: { label: '🛵 Out for Delivery', cls: 'bg-blue-600 hover:bg-blue-500 text-white' },
  delivered:        { label: '✅ Mark Delivered',   cls: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {};
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-sm ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const OrderRow = ({ order, onStatusChange, updating }) => {
  const [expanded, setExpanded] = useState(false);
  const [noteModal, setNoteModal] = useState(null); // { nextStatus }
  const [note, setNote] = useState('');
  const nextStatuses = VALID_NEXT[order.status] || [];

  const confirmUpdate = async () => {
    await onStatusChange(order._id, noteModal.nextStatus, note);
    setNoteModal(null);
    setNote('');
  };

  return (
    <>
      <div className={`bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 border  transition-all mb-3 ${STATUS_CONFIG[order.status]?.border || 'border-stone-100 dark:border-stone-800'}`}>
        {/* Main row */}
        <div className="p-5">
          <div className="flex flex-wrap gap-4 items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-black text-stone-800 dark:text-stone-100">{order.orderNumber}</span>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{order.customerName}</p>
              <p className="text-xs text-stone-400">{order.customerEmail}</p>
              <p className="text-xs text-stone-400 mt-1">
                {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                ${(order.total / 100).toFixed(2)}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-stone-400 capitalize mt-0.5">{order.paymentMethod?.replace('_', ' ')}</div>
            </div>
          </div>

          {/* Action buttons */}
          {nextStatuses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {nextStatuses.map((ns) => {
                const btn = NEXT_LABELS[ns];
                if (!btn) return null;
                return (
                  <button
                    key={ns}
                    onClick={() => setNoteModal({ nextStatus: ns })}
                    disabled={updating === order._id}
                    className={`text-xs font-bold px-4 py-2 rounded-sm transition-all disabled:opacity-50 ${btn.cls}`}
                  >
                    {updating === order._id ? '…' : btn.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors mt-3"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Hide' : 'View'} details
          </button>
        </div>

        {/* Expanded */}
        {expanded && (
          <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-4 space-y-4">
            {/* Items */}
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Items</p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 dark:bg-stone-800">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-[10px]">?</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate">{item.name}</p>
                      {item.addOns?.length > 0 && (
                        <p className="text-[10px] text-stone-400">{item.addOns.map(a => a.name).join(', ')}</p>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 text-right">
                      ×{item.quantity} · ${(item.lineTotal / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address + Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-stone-50 dark:bg-stone-800 rounded-sm px-3 py-2.5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="text-xs text-stone-700 dark:text-stone-300">{order.deliveryAddress?.line1}, {order.deliveryAddress?.city}</p>
                {order.deliveryAddress?.instructions && (
                  <p className="text-[10px] text-stone-400 mt-1 italic">"{order.deliveryAddress.instructions}"</p>
                )}
              </div>
              {order.notes && (
                <div className="bg-stone-50 dark:bg-stone-800 rounded-sm px-3 py-2.5">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Customer Note</p>
                  <p className="text-xs text-stone-700 dark:text-stone-300 italic">"{order.notes}"</p>
                </div>
              )}
            </div>

            {/* Status history */}
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Timeline</p>
              <div className="space-y-1.5">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-sm mt-0.5 flex-shrink-0 ${STATUS_CONFIG[h.status]?.dot || 'bg-stone-400'}`} />
                    <div className="flex-1">
                      <span className="font-semibold text-stone-700 dark:text-stone-300 capitalize">
                        {STATUS_CONFIG[h.status]?.label || h.status}
                      </span>
                      {h.note && <span className="text-stone-400"> — {h.note}</span>}
                    </div>
                    <span className="text-stone-400 flex-shrink-0">{new Date(h.changedAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 max-w-sm w-full border border-stone-100 dark:border-stone-800 shadow-2xl">
            <h3 className="font-black text-stone-800 dark:text-stone-100 mb-1">
              {NEXT_LABELS[noteModal.nextStatus]?.label}
            </h3>
            <p className="text-sm text-stone-400 mb-4">Order: <strong className="text-orange-600">{order.orderNumber}</strong></p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note (e.g. 'Rider is on the way')"
              rows={3}
              className="w-full px-3 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setNoteModal(null); setNote(''); }}
                className="flex-1 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold py-2.5 rounded-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm">
                Cancel
              </button>
              <button onClick={confirmUpdate}
                className={`flex-1 font-bold py-2.5 rounded-sm transition-all text-sm ${NEXT_LABELS[noteModal.nextStatus]?.cls}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rejected', label: 'Rejected' },
];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [meta, setMeta] = useState({ total: 0 });

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('status', activeTab);
      if (search.trim()) params.set('search', search.trim());
      params.set('limit', '50');

      const res = await api.get(`/orders?${params.toString()}`);
      setOrders(res.data.data || []);
      setMeta(res.data.meta || { total: 0 });
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Auto-refresh every 20s
  useEffect(() => {
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus, note) => {
    setUpdating(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus, note });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const pendingCount = orders.filter(o => activeTab === 'all' && o.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-800 dark:text-stone-100 flex items-center gap-2">
            Manage Orders
            {pendingCount > 0 && (
              <span className="text-sm bg-amber-500 text-white font-bold px-2 py-0.5 rounded-sm animate-pulse">
                {pendingCount} pending
              </span>
            )}
          </h1>
          <p className="text-sm text-stone-400 mt-1">Total: {meta.total} orders</p>
        </div>
        <button onClick={fetchOrders}
          className="inline-flex items-center gap-2 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 px-4 py-2 rounded-sm text-sm font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number, customer name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-sm border transition-all ${
              activeTab === tab.value
                ? 'bg-orange-600 text-white border-orange-600'
                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-orange-300 dark:hover:border-orange-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-5 border border-stone-100 dark:border-stone-800">
              <div className="skeleton h-5 w-40 rounded mb-3 opacity-50" />
              <div className="skeleton h-4 w-52 rounded mb-2 opacity-50" />
              <div className="skeleton h-3 w-full rounded opacity-50" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 border border-stone-100 dark:border-stone-800">
          <Package className="w-12 h-12 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
          <p className="text-stone-500 dark:text-stone-400 font-medium">No orders found</p>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-1">
            {activeTab !== 'all' ? `No ${activeTab} orders` : 'Orders will appear here once customers start placing them'}
          </p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} updating={updating} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
