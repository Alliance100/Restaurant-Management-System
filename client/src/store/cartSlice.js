import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('tablecraft_cart');
    if (!saved) return { items: [] };
    
    const parsed = JSON.parse(saved);
    // Clear cart if 15 minutes have passed since last update
    if (parsed.updatedAt && Date.now() - parsed.updatedAt > 15 * 60 * 1000) {
      localStorage.removeItem('tablecraft_cart');
      return { items: [] };
    }
    return parsed;
  } catch {
    return { items: [] };
  }
};

const saveCart = (state) => {
  try {
    const data = { items: state.items, updatedAt: Date.now() };
    localStorage.setItem('tablecraft_cart', JSON.stringify(data));
  } catch (_) { }
};

const initialState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {

    addToCart: (state, action) => {
      const { menuItemId, name, slug, imageUrl, categoryName, basePrice, quantity = 1, selectedAddOns = [] } = action.payload;

      const addonKey = selectedAddOns.map(a => a._id).sort().join('|');
      const existingIndex = state.items.findIndex(
        (i) => i.menuItemId === menuItemId && i.addonKey === addonKey
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          cartId: `${menuItemId}-${addonKey}-${Date.now()}`,
          menuItemId,
          name,
          slug,
          imageUrl,
          categoryName,
          basePrice,
          quantity,
          selectedAddOns,
          addonKey,
        });
      }

      saveCart(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.cartId !== action.payload);
      saveCart(state);
    },

    updateQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find((i) => i.cartId === cartId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.cartId !== cartId);
        } else {
          item.quantity = quantity;
        }
      }
      saveCart(state);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state);
    },
  },
});

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => {
    const addOnsTotal = i.selectedAddOns.reduce((s, a) => s + a.price, 0);
    return sum + (i.basePrice + addOnsTotal) * i.quantity;
  }, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
