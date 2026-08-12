# TableCraft

Hey there! This is **TableCraft**, a full-stack restaurant management system I put together. 

I built this because I wanted a platform that actually looks good and works well for everyone involved. It handles everything from customers browsing the menu and placing orders, to the restaurant staff managing the kitchen and updating inventory. 

The project is split into three main parts: the customer-facing website, a secure admin dashboard, and a Node.js backend tying it all together.

---

## What it can do

### For the Customers
* **Browsing the Menu**: Customers can filter dishes by category, sort by price, and check for things like vegan or gluten-free options.
* **Ordering Food**: Every dish has a detailed page where people can add custom extras. There's a slide-out cart that remembers what you added, and it even clears itself out after 15 minutes of inactivity so the database doesn't get clogged with abandoned orders.
* **Payments**: I wired up Stripe so customers can pay securely with their credit cards. If they prefer paying in person, there's a standard Cash on Delivery option too.
* **Order Tracking**: Once an order is placed, the status page automatically updates in real-time. You don't even have to refresh the page to see when your food is out for delivery.
* **Dark Mode**: Because everyone loves dark mode. There's a simple toggle that switches the entire theme instantly.

### For the Restaurant Staff (Admin Portal)
* **Dashboard**: Gives a quick bird's-eye view of how the business is doing today—total revenue, active orders, and customer count.
* **Managing Orders**: Admins have a dedicated table to see incoming orders. With one click, they can move an order from "Pending" to "Preparing" to "Out for Delivery".
* **Inventory Control**: You can easily add new dishes or tweak existing ones. Image uploads are handled via drag-and-drop and get sent straight to Cloudinary.
* **Customer Messages**: Any messages sent from the public Contact page show up here in a clean inbox format.

---

## What I used to build it

**Frontend (Both Client & Admin Apps)**
* React 19 and Vite
* Tailwind CSS v4 for all the styling
* React Router v7 for navigation
* Redux Toolkit to manage things like the shopping cart and user sessions
* Framer Motion for some smooth page transitions and micro-animations
* Stripe Elements for the checkout flow

**Backend (The API)**
* Node.js and Express v5
* MongoDB (Atlas) and Mongoose
* JSON Web Tokens (JWT) stored in HTTP-only cookies for secure logins
* Cloudinary for hosting user-uploaded images
* Stripe's Node SDK

---

## Want to run it yourself?

If you want to spin this up on your local machine, here is exactly how to do it.

### 1. External stuff you'll need
You can't really run the app without these three things:
- A MongoDB database URL (MongoDB Atlas is free and easy).
- A Cloudinary account (also free) so image uploads actually work.
- A Stripe account to get your test API keys.

### 2. Set up your environment variables
You'll need to create three `.env` files in different folders.

**In the `server` folder (`server/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=make_up_a_random_secret_string
JWT_REFRESH_SECRET=make_up_another_random_string
CLIENT_ORIGIN=http://localhost:5173
ADMIN_ORIGIN=http://localhost:5174
CLOUDINARY_URL=your_cloudinary_url_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

**In the `client` folder (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

**In the `admin` folder (`admin/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Boot it up

You'll need three separate terminal windows to run all the pieces at the same time.

**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 (Customer Site):**
```bash
cd client
npm install
npm run dev
```

**Terminal 3 (Admin Dashboard):**
```bash
cd admin
npm install
npm run dev
```

### 4. Create your first admin account
To actually log into the admin dashboard, you'll need an account. I wrote a quick seed script that creates a default one for you. Just open a new terminal and run:
```bash
cd server
npm run seed
```
You can now log into the admin portal using `admin@tablecraft.com` and the password `admin123`.

---

## Deploying to Vercel

If you want to put this on the internet, Vercel is the easiest way.
1. Push your code to GitHub.
2. Go to Vercel and import the `server` folder as one project, the `client` folder as a second project, and the `admin` folder as a third project.
3. Paste in all the environment variables from step 2 into their respective Vercel project settings.
4. Hit deploy! 

*Quick note: I already configured the backend to allow cross-domain cookies, so logins will work perfectly across different Vercel URLs out of the box.*
