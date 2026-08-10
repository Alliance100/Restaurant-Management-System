# TableCraft - Restaurant Management System 🍽️

Welcome to **TableCraft**, a modern, premium, and fully responsive Restaurant Management System built from the ground up! 

This project aims to provide a seamless experience for both hungry customers browsing the menu, and restaurant staff managing the platform.

## ✨ Features Built So Far

### 🎨 Stunning User Interface
* **Premium Design**: Built with Tailwind CSS v4, featuring glassmorphism, smooth animations, gradient text, and dynamic hover effects.
* **Full Dark Mode Support**: A seamless Sun/Moon toggle in the navigation bar that instantly switches the entire site (and scrollbars!) between light and dark themes.
* **Mobile Responsive**: Carefully crafted layouts that look perfect on tiny mobile phones, tablets, and large desktop monitors.

### 👥 Customer Experience (Public Pages)
* **Home Page**: A beautiful landing page with a hero section, animated statistics, "Why Choose Us" features, and chef's featured picks.
* **Menu Page**: A robust menu browser where customers can:
  * Filter by category (e.g., Burgers, Pizza, Drinks)
  * Filter by dietary preferences (Vegetarian, Vegan, Gluten-Free)
  * Sort by price (High/Low) or newest items
  * Search for specific dishes by name
* **Menu Item Details**: A clean, split-screen detailed view of any specific dish showing price, prep time, and dietary tags.

### 🔒 Security & Authentication
* **Secure Login & Registration**: Custom authentication system built with JSON Web Tokens (JWT).
* **HTTP-Only Cookies**: Tokens are securely stored in HTTP-Only cookies to protect against XSS attacks.
* **Role-Based Access**: The system differentiates between normal customers and `admin` users.

### 👨‍🍳 Admin Portal
* **Admin Dashboard**: A secure area only accessible to restaurant staff, featuring live statistics (total users, menu items, categories).
* **Category Management**: Admins can create, edit, and deactivate menu categories. (Deactivating a category automatically hides all its menu items!).
* **Menu Item Management**: Full control to add new dishes, update prices, change dietary tags, and mark items as "Featured".
* **Drag-and-Drop Image Uploads**: Custom image uploader that securely saves food photos directly to the server, rather than relying on external image URLs.

---

## 🛠️ Tech Stack

**Frontend (Client)**
* React 19 + Vite
* Tailwind CSS v4
* React Router DOM (Routing)
* Redux Toolkit (State Management)
* Lucide React (Icons)
* Axios (API calls)

**Backend (Server)**
* Node.js + Express
* MongoDB + Mongoose (Database)
* JSON Web Tokens (JWT) + Cookie Parser (Auth)
* Multer (Image file uploads)
* bcryptjs (Password hashing)

---

## 🚀 How to Run Locally

### 1. Database Setup
You will need a MongoDB connection string. You can use MongoDB Atlas (cloud) or a local MongoDB instance. 

### 2. Environment Variables
Create a `.env` file in the `server` folder with the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_ACCESS_SECRET=your_super_secret_key_here
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Start the Backend
Open a terminal in the `server` directory:
```bash
npm install
npm run dev
```

### 4. Start the Frontend
Open a terminal in the `client` directory:
```bash
npm install
npm run dev
```

The app will be running at `http://localhost:5173`. 
*(Note: If port 5173 is in use, Vite will automatically use 5174, which the backend is also configured to accept!)*
