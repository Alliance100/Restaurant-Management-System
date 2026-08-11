# TableCraft - Restaurant Management System 🍽️

Welcome to **TableCraft**, a modern, premium, and fully responsive Restaurant Management System built from the ground up!

This project provides a seamless experience for both hungry customers browsing the menu and ordering food, and restaurant staff managing the full operation.

---

## ✨ Features Built So Far

### 🎨 Stunning User Interface
* **Premium Design**: Built with Tailwind CSS v4, featuring glassmorphism, smooth animations, gradient text, and dynamic hover effects.
* **Full Dark Mode Support**: A seamless Sun/Moon toggle that instantly switches the entire site between light and dark themes.
* **Mobile Responsive**: Carefully crafted layouts for mobile phones, tablets, and large desktop monitors.
* **Dynamic Titles**: Browser tab shows "TableCraft" on the public site and "TableCraft Admin | [Page]" in the admin panel.

### 👥 Customer Experience (Public Pages)
* **Home Page**: A beautiful landing page with a hero section, animated statistics, "Why Choose Us" features, and chef's featured picks.
* **Menu Page**: A robust menu browser with:
  * Filter by category (e.g., Burgers, Pizza, Drinks)
  * Filter by dietary preferences (Vegetarian, Vegan, Gluten-Free)
  * Sort by price (High/Low) or newest items
  * Search for specific dishes by name
* **Menu Item Details**: A clean split-screen view of any dish showing price, prep time, dietary tags, customizable add-ons, and a working **Add to Cart** button.
* **Contact Us**: A beautiful contact page with our address (**Gulberg, Lahore**), phone, email, opening hours, stylized map, and a working contact form.

### 🛒 Shopping Cart
* **Cart Drawer**: A premium slide-out cart panel accessible from any page via the navbar icon.
* **Live Cart Badge**: Item count shown on the cart icon in real time.
* **Full Cart CRUD**: Add items (with add-ons), update quantity, remove items, or clear the entire cart.
* **Persistent Cart**: Cart is saved to `localStorage` — survives page refreshes.

### 📋 Ordering System (Cash on Delivery)
* **Checkout Page**: Full form with delivery address, special instructions, coupon code validation, and a live order summary.
* **Coupon Codes**: Admin can create discount codes (percentage or fixed amount) with optional min-order limits, usage limits, and expiry dates.
* **Order Placement**: Orders saved to the database with a unique order number (e.g. `TC-20260811-0001`).
* **Session Persistence**: Logging in once keeps you logged in across page refreshes.

### 📦 Order Tracking (Customer)
* **My Orders Page**: Lists all past and active orders separated by status.
* **Live Status Updates**: Auto-polls every 15 seconds while an order is active.
* **Progress Tracker**: Animated progress bar through the order lifecycle.
* **Order Timeline**: Full history of every status change with timestamps and notes.
* **Cancel Order**: Customers can cancel their own orders while they are still `pending`.

### 🔄 Order Lifecycle Flow
```
Pending (waiting for approval)
  ↓ Admin approves
Confirmed
  ↓ Kitchen starts
Preparing
  ↓ Rider picks up
Out for Delivery
  ↓ Customer receives
Delivered ✅

OR
Pending → Rejected ✗  (Admin rejects)
Confirmed/Pending → Cancelled ✗  (Admin or customer cancels)
```

### 🔒 Security & Authentication
* **Secure Login & Registration**: Custom authentication with JSON Web Tokens (JWT).
* **HTTP-Only Cookies**: Tokens stored in HTTP-Only cookies (XSS protection).
* **Role-Based Access**: Differentiates between `customer` and `admin` users.
* **Session Persistence**: App restores login state on page reload via `/auth/me`.

### 👨‍🍳 Admin Portal
* **Admin Dashboard**: Real-time stats — total orders, pending orders, today's orders & revenue, total customers, menu items, and featured count.
* **Manage Orders**: Full order management table with:
  * Status tabs (All, Pending, Confirmed, Preparing, etc.)
  * Search by order number, customer name or email
  * One-click status transitions with optional admin notes
  * Confirmation modal before each status change
  * Auto-refresh every 20 seconds
  * Expandable order detail view with address, items, and full timeline
* **Category Management**: Create, edit, and deactivate menu categories.
* **Menu Item Management**: Full CRUD for dishes with dietary tags, add-ons, featured flags, and drag-and-drop image uploads.
* **Coupon Management**: Create, list, and toggle discount codes.

---

## 🛠️ Tech Stack

**Frontend (Client)**
* React 19 + Vite
* Tailwind CSS v4
* React Router DOM v7
* Redux Toolkit (Auth + Cart state)
* Lucide React (Icons)
* Axios (API calls)

**Backend (Server)**
* Node.js + Express v5
* MongoDB + Mongoose
* JSON Web Tokens (JWT) + Cookie Parser
* Multer (Image uploads)
* bcrypt (Password hashing)

---

## 🚀 How to Run Locally

### 1. Database Setup
You will need a MongoDB connection string. You can use MongoDB Atlas (cloud) or a local MongoDB instance.

### 2. Environment Variables
Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_ACCESS_SECRET=your_super_secret_key_here
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Start the Backend
```bash
cd server
npm install
npm run dev
```

### 4. Start the Frontend
```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### 5. Create an Admin Account
Run the seed script to create a default admin user:
```bash
cd server
npm run seed
```
Default admin: `admin@tablecraft.com` / `admin123`

---

## 📍 Restaurant Info
**TableCraft Restaurant**
Main Gulberg, Lahore, Punjab, Pakistan
📞 +92 300 1234567  |  ✉️ hello@tablecraft.pk
