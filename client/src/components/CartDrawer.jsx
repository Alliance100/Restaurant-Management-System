import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { selectCartItems, selectCartSubtotal, removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const deliveryFee = 200; // $2.00

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-stone-900 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">Your Cart</h2>
              <p className="text-xs text-stone-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                className="text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-sm flex items-center justify-center text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-none border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                <Package className="w-10 h-10 text-stone-300 dark:text-stone-600" />
              </div>
              <div>
                <p className="text-stone-700 dark:text-stone-300 font-bold mb-1">Your cart is empty</p>
                <p className="text-sm text-stone-400">Add some delicious items from our menu!</p>
              </div>
              <Link
                to="/menu"
                onClick={onClose}
                className="mt-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-sm font-bold text-sm transition-all"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const addOnsTotal = item.selectedAddOns.reduce((s, a) => s + a.price, 0);
              const itemTotal = (item.basePrice + addOnsTotal) * item.quantity;

              return (
                <div
                  key={item.cartId}
                  className="bg-stone-50 dark:bg-stone-800 rounded-none border border-stone-200 dark:border-stone-800 p-3 flex gap-3"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 bg-stone-200 dark:bg-stone-700">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No img</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">{item.name}</p>
                    {item.selectedAddOns.length > 0 && (
                      <p className="text-xs text-stone-400 mt-0.5 truncate">
                        + {item.selectedAddOns.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center bg-white dark:bg-stone-700 rounded-lg p-0.5 gap-0.5 border border-stone-200 dark:border-stone-600">
                        <button
                          onClick={() => dispatch(updateQuantity({ cartId: item.cartId, quantity: item.quantity - 1 }))}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-stone-800 dark:text-stone-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(updateQuantity({ cartId: item.cartId, quantity: item.quantity + 1 }))}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-black text-stone-800 dark:text-stone-100">
                        ${(itemTotal / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(item.cartId))}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all self-start"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 dark:border-stone-800 p-5 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>Delivery</span>
                <span>${(deliveryFee / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span>Total</span>
                <span>${((subtotal + deliveryFee) / 100).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold py-3.5 rounded-none border border-stone-200 dark:border-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200 dark:shadow-none"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
