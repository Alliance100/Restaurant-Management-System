# Week 3 Implementation Summary

This document outlines all the features, pages, and functionalities built during **Week 3** of the TableCraft Restaurant Management System project.

## 🛒 Shopping Cart System
- **State Management**: Implemented `cartSlice.js` using Redux Toolkit to manage cart items, quantities, and selected add-ons.
- **Persistence**: Cart data is synchronized with browser `localStorage`, ensuring users don't lose their selected items upon page refresh.
- **Cart Drawer UI**: Created a slide-out `CartDrawer.jsx` component that displays added items, allows quantity adjustments (with limits), item removal, and shows subtotal + delivery fees.
- **Navbar Integration**: Added a live cart badge to the `PublicLayout` navbar that updates dynamically as items are added.
- **Add to Cart**: Wired up the "Add to Cart" button in `MenuItemDetails.jsx` to dispatch items directly to the Redux store with selected customizations.

## 📦 Order System & Checkout
- **Backend Infrastructure**: 
  - Created `Order.js` model with snapshotting (storing item details at the time of purchase to prevent historical changes if menu items are modified later).
  - Built `orderController.js` handling order creation, retrieval for customers/admins, cancellation, and status updates.
- **Checkout Page**: 
  - Designed `Checkout.jsx` allowing users to input delivery addresses, view order summaries, and apply discount coupons.
  - Defaults to "Cash on Delivery" (COD) payment method.
  - Submits structured order data (including add-ons and notes) to the backend.

## 🔄 Order Tracking & Management
- **Customer Facing (My Orders)**:
  - Created `MyOrders.jsx` where users can view their active and past orders.
  - Implemented an animated visual progress tracker (`pending` → `confirmed` → `preparing` → `out_for_delivery` → `delivered`).
  - Added live-polling (every 15 seconds) for active orders so customers see status updates in real-time.
  - Allowed order cancellation while in the `pending` state.
- **Admin Facing (Manage Orders)**:
  - Built `ManageOrders.jsx` in the admin panel to view and process all incoming orders.
  - Implemented status tabs to filter orders by state.
  - Added a search bar (by order number, name, or email).
  - Created intuitive action buttons (e.g., "Approve", "Start Preparing", "Out for Delivery") that prompt a confirmation modal where admins can optionally add notes.
  - Added auto-refresh (every 20 seconds) to ensure admins always see the latest orders.

## 🎟️ Coupon System
- **Backend**: Created `Coupon.js` model and `couponController.js` to handle coupon creation, validation, and usage limits.
- **Admin Management**: Built `ManageCoupons.jsx` allowing admins to:
  - Create fixed (Rs) or percentage (%) discount codes.
  - Set minimum order amounts, maximum discount caps (for percentages), usage limits, and expiry dates.
  - Toggle coupons active/inactive instantly.
- **Checkout Integration**: Wired the coupon validation into the checkout flow, recalculating totals on the fly when valid codes are applied.

## 📞 Contact Page & General UI
- **Contact Us**: Created a premium `Contact.jsx` page featuring the restaurant's address (**Gulberg, Lahore**), phone number, email, and opening hours, along with a stylized map illustration and a working contact form.
- **Title Fixes**: 
  - Updated the public `index.html` title from default "client" to "TableCraft".
  - Implemented dynamic `document.title` in `AdminLayout.jsx` so browser tabs read "TableCraft Admin | [Page Name]" based on the current admin route.
- **Admin Dashboard Real Stats**: Replaced the "Coming Week 3" placeholders in `Dashboard.jsx` with real data fetching from the backend (Total Orders, Pending Orders, Today's Revenue, etc.).
- **Session Persistence**: Updated `App.jsx` to verify session cookies on app mount (`/auth/me`), ensuring users remain logged in after page refreshes.

## ⚙️ Backend Adjustments
- Registered all new routes (`orderRoutes.js`, `couponRoutes.js`) in `app.js`.
- Updated `statsController.js` to aggregate real order counts and revenue data for the admin dashboard.
- Ensured all routes are properly protected with `authenticate` and `requireRole` middleware where necessary.
