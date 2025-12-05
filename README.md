# Future Generation Academy Website
A modern, dynamic, and fully scalable website for Future Generation Academy (FGA), developed by TriCore Information Technology Solutions. The platform provides a complete ecosystem for sports academy operations including events, tournaments, registrations, member accounts, and subscription payments.

---

## 📌 Project Overview
This project delivers a full-feature web application for FGA, including:
- Dynamic website with academy information
- Events & tournament management
- Online registration system for academy programs
- Membership accounts (signup, login, profile)
- Secure subscription payments
- Administrative panel for full backend control

The system is designed for performance, scalability, and future expansion, such as mobile app integration or attendance tracking features.

---

## 🏗️ Tech Stack
### Frontend — React + Vite
- Fast dev environment for juniors
- Component-based UI
- TailwindCSS for styling

### Backend — Node.js + Express
- Lightweight and beginner-friendly
- REST API structure
- Clear routing and controller structure

### Database — MySQL
- Structured, reliable & simple for beginners
- Supports future scaling

### Payments — Stripe
- Easiest and safest payment gateway for developers
- Supports secure membership subscription payments

### Hosting
- Frontend: Vercel or Netlify  
- Backend: Railway, Render, or similar  
- Database: Railway/MySQL hosting or client’s hosting provider

---

## 📁 Repository Structure
/frontend → React (Vite) app
/backend → Express server
/database → SQL schema + migrations
/docs → PRD, DRD, TRD, Design Reference
/docs/design-references → UI/UX reference materials (Bayer 04 inspired)

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up MySQL database:**
   - Make sure MySQL server is running
   - Create the database:
     ```sql
     CREATE DATABASE fgaweb;
     ```
   - Run the schema file:
     ```bash
     mysql -u root -p fgaweb < database/schema.sql
     ```
     Or import it through MySQL Workbench/phpMyAdmin

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=your_mysql_password
     DB_NAME=fgaweb
     JWT_SECRET=your_secure_random_string_here
     PORT=5000
     ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

---


---

## 🚀 Deployment
TriCore will handle:
- Server setup
- SSL configuration
- Domain connection
- CI/CD deployment (if applicable)

---

## 🔐 Security
Includes:
- Encrypted passwords
- Input validation
- OWASP protection (SQLi, XSS, CSRF)
- HTTPS enforced

---

## 🔧 Maintenance
TriCore provides:
- 6 months of free maintenance
- Bug fixes & performance updates
- Technical support via email/phone/WhatsApp

---

## 📄 License
© TriCore Information Technology Solutions  
TriCore retains ownership of all source code and system architecture.  
FGA receives a permanent, non-exclusive license for operational use after full payment (See Agreement).