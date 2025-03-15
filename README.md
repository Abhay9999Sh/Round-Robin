# 🎟️ Round-Robin Coupon System

## 🚀 Overview
The **Round-Robin Coupon System** is a Next.js web application that distributes coupons fairly while implementing abuse prevention strategies. Users can claim coupons without logging in, and the system ensures fair distribution using **IP tracking and cookie-based restrictions**.

---

## ✨ Features
- ✅ **Fair Coupon Distribution** – Coupons are assigned sequentially to ensure even allocation.
- ✅ **Guest Access** – No login or account creation required.
- ✅ **Abuse Prevention** – Implements **IP tracking** and **cookie-based** restrictions.
- ✅ **User Feedback** – Displays messages for successful claims and cooldown periods.
- ✅ **Live Deployment** – Easily deployable for public access.

---

## 🛠️ Tech Stack
- **Next.js (Latest)** – React framework with App Router.
- **React (Latest)** – UI library for frontend components.
- **MongoDB (Latest)** – Stores coupons and user claims.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **shadcn/ui** – Pre-built UI components.
- **Lucide React** – Icon library.

---

## ⚙️ Setup Instructions

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Abhay9999Sh/Round-Robin.git
cd round-robin-coupon-system

```
### **2 Install Dependencies**
```sh
npm install
```

### **3 Configure Environment Variables**
- Create a .env.local file in the root directory:
```sh
MONGODB_URI=your_mongodb_connection_string
```
### **4 Start the Development Server**
```sh
npm run dev
```

- **App will be available at http://localhost:3000.**

## 🔗 Routes

### **1️⃣ Seed the Database**
Before using the application, seed the database with initial coupons.

- **Local:** `http://localhost:3000/api/seed`
- **Production:** `https://your-vercel-domain.vercel.app/api/seed`

This will generate **50 sample coupons** in your MongoDB database.

### **2️⃣ Main Application (Claim Coupons)**
- **Local:** `http://localhost:3000`
- **Production:** `https://your-vercel-domain.vercel.app`

### **3️⃣ Admin Dashboard (Manage Coupons)**
- **Local:** `http://localhost:3000/admin`
- **Production:** `https://your-vercel-domain.vercel.app/admin`

---

## 🔐 Abuse Prevention Strategies

The application implements multiple layers of protection against abuse:

- **IP Tracking** – Each coupon claim is associated with the user's IP address. The system prevents the same IP from claiming multiple coupons within the **one-hour cooldown period**.
- **Cookie Tracking** – A unique user ID is stored in a **cookie** and used to track claims, preventing users from claiming multiple coupons by clearing their browser cache.
- **Cooldown Timers** – Users must wait **one hour** between coupon claims. A countdown timer is displayed to indicate when they can claim again.

---

## 🎯 How It Works

### **Round-Robin Distribution**
Coupons are distributed **sequentially** to ensure fairness:

1. When a user requests a coupon, the system finds the **first available (unclaimed) coupon** in the database.
2. The coupon is **marked as claimed** and linked to the user's session.
3. This guarantees **equal distribution** of coupons across all users.

### **Database Structure**
The system uses two main MongoDB collections:

- **`coupons`** – Stores all available coupons with their **claim status**.
- **`claims`** – Tracks **user claims with timestamps** to enforce cooldown restrictions.

---

## ⚙️ Customization Options

You can modify the system to better suit your needs:

- **Change the cooldown period** – Update the `CLAIM_COOLDOWN` constant in `app/actions.ts` (default: **3600 seconds/1 hour**).
- **Add more coupons** – Use the **admin interface** (`/admin`) to manually add coupons.
- **Modify the UI** – Edit the **Tailwind CSS** styles in components for a custom look.

---

## 🔒 Security Considerations

For a production environment, consider implementing:

- **Admin Authentication** – Secure the admin area using authentication middleware.
- **Rate Limiting** – Prevent brute-force attempts by adding rate-limiting mechanisms.
- **Enhanced User Tracking** – Consider a **stronger tracking mechanism** for high-security applications.

## 💡 Final Thoughts

The **Round-Robin Coupon System** is designed to distribute coupons fairly while preventing abuse. With **IP tracking, cookie-based restrictions, and cooldown timers**, users can claim coupons securely and efficiently.  

Feel free to customize and extend the system as needed. Contributions, feedback, and suggestions are always welcome! 🚀  

For any queries, reach out at **[abhay987123Sh@gmail.com](mailto:abhay987123Sh@gmail.com)**.  
Happy coding! 🎉
