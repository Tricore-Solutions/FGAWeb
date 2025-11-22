# FGA Website - MVP Task Breakdown
_Granular, production-ready tasks for junior developers_

> **Philosophy**: Each task should take 1-3 hours. Every task has clear acceptance criteria. Tasks are organized by feature, not by tech layer.

---

## 🎯 Phase 1: Project Foundation & Setup

### 1.1 Development Environment
**Issue #1: Set up local development environment**
- [ ] Install Node.js (LTS version) and verify with `node --version`
- [ ] Install Git and configure username/email
- [ ] Clone repository: `git clone <repo-url>`
- [ ] Create a new branch: `git checkout -b feat/dev-setup`
- **Acceptance**: Can run `node --version` and `git --version` successfully
- **Analogy**: Setting up your toolbox before building furniture

---

### 1.2 Frontend Project Initialization
**Issue #2: Initialize React frontend with Vite**
- [ ] Run `npm create vite@latest frontend -- --template react`
- [ ] Navigate to `frontend/` and run `npm install`
- [ ] Start dev server with `npm run dev` and verify default page loads at `localhost:5173`
- [ ] Remove boilerplate files: `App.css`, default `App.jsx` content, `assets/react.svg`
- **Acceptance**: Clean React app running without errors
- **Analogy**: Getting a blank canvas before painting

**Issue #3: Configure Tailwind CSS**
- [ ] Install Tailwind: `npm install -D tailwindcss postcss autoprefixer`
- [ ] Run `npx tailwindcss init -p` to create config files
- [ ] Update `tailwind.config.js` with correct content paths: `"./index.html", "./src/**/*.{js,jsx}"`
- [ ] Add Tailwind directives to `src/index.css`
- [ ] Test by adding `className="text-blue-500"` to a component and verify it works
- **Acceptance**: Tailwind classes render correctly
- **Time Estimate**: 30 minutes

**Issue #4: Create project folder structure**
- [ ] Create folders: `src/components/`, `src/pages/`, `src/services/`, `src/context/`, `src/hooks/`, `src/assets/`, `src/styles/`
- [ ] Create `.env` file with placeholder: `VITE_API_URL=http://localhost:5000`
- [ ] Update `.gitignore` to include `.env`
- **Acceptance**: Clean folder structure visible in IDE
- **Analogy**: Organizing your pantry with labeled shelves

---

### 1.3 Design System & Style Guide
**Issue #5: Create Design System documentation structure**
- [ ] Create `docs/DESIGN_SYSTEM.md` file
- [ ] Create folders: `frontend/src/styles/design-tokens/`, `frontend/src/styles/guides/`
- [ ] Set up basic documentation sections: Brand Colors, Typography, Spacing, Components
- **Acceptance**: Design system file structure is ready
- **Time Estimate**: 30 minutes
- **Analogy**: Creating a recipe book before cooking

**Issue #6: Define brand colors and design tokens**
- [ ] Create `frontend/src/styles/design-tokens/colors.js` with FGA brand colors:
  - Primary: Blue (#007bff), White (#ffffff)
  - Secondary: Black (#000000), Gray (#e5e5e5)
  - Accent: Sports green (#10b981)
  - Status colors: Success, Warning, Error, Info
- [ ] Export color object for use in components
- [ ] Document colors in `DESIGN_SYSTEM.md` with visual swatches (using markdown color blocks)
- **Acceptance**: All developers use consistent colors from this file
- **Time Estimate**: 1 hour

**Issue #7: Define typography system**
- [ ] Install Google Fonts (Poppins for headings, Inter for body) or use system fonts
- [ ] Create `frontend/src/styles/design-tokens/typography.js` with:
  - Font families
  - Font sizes (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
  - Font weights (regular, medium, semibold, bold)
  - Line heights
- [ ] Configure Tailwind to use these fonts in `tailwind.config.js`
- [ ] Document typography scale in `DESIGN_SYSTEM.md` with examples
- **Acceptance**: Typography is consistent across all pages
- **Time Estimate**: 1.5 hours

**Issue #80: Define spacing and layout system**
- [ ] Create `frontend/src/styles/design-tokens/spacing.js` with:
  - Spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
  - Container max-widths (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
  - Breakpoints (mobile: 320px, tablet: 768px, desktop: 1024px, wide: 1440px)
- [ ] Document spacing system with visual examples
- **Acceptance**: Layouts use consistent spacing values
- **Time Estimate**: 1 hour

**Issue #81: Create component style guide structure**
- [ ] Create `frontend/src/styles/guides/COMPONENTS.md`
- [ ] Set up sections for each component type: Buttons, Forms, Cards, Navigation, etc.
- [ ] For each component, document:
  - **Purpose**: What it's used for
  - **Variants**: Different styles (primary, secondary, etc.)
  - **Props**: What data it accepts
  - **Usage example**: Code snippet
  - **Visual preview**: Screenshot or description
- **Acceptance**: New developers can reference this guide before building
- **Time Estimate**: 1.5 hours
- **Analogy**: A cookbook with pictures showing how each dish should look

**Issue #82: Define shadow and border radius tokens**
- [ ] Create `frontend/src/styles/design-tokens/effects.js` with:
  - Shadow levels (none, sm, base, md, lg, xl)
  - Border radius (none, sm, base, md, lg, full)
  - Transition durations (fast: 150ms, base: 200ms, slow: 300ms)
- [ ] Add to Tailwind config
- [ ] Document with visual examples
- **Acceptance**: Cards and buttons have consistent shadows and rounded corners
- **Time Estimate**: 45 minutes

**Issue #83: Create layout templates documentation**
- [ ] Create `frontend/src/styles/guides/LAYOUTS.md`
- [ ] Document common page layouts:
  - **Full-width hero + content grid**
  - **Two-column sidebar layout** (for admin panel)
  - **Centered card layout** (for login/signup)
  - **Table layout** (for admin lists)
- [ ] Include wireframes or ASCII diagrams for each layout
- [ ] Provide code examples with Tailwind classes
- **Acceptance**: Developers know which layout pattern to use for each page type
- **Time Estimate**: 2 hours

**Issue #76: Create icon library guide**
- [ ] Install icon library: `npm install lucide-react` or `react-icons`
- [ ] Create `frontend/src/styles/guides/ICONS.md`
- [ ] Document which icons to use for common actions:
  - Navigation: Home, User, Calendar, Settings, Logout
  - Actions: Plus, Edit, Delete, Save, Cancel
  - Status: CheckCircle, XCircle, AlertTriangle, Info
- [ ] Show code examples
- **Acceptance**: Consistent icon usage across the app
- **Time Estimate**: 1 hour

---

### 1.4 Backend Project Initialization

### 1.3 Backend Project Initialization
**Issue #77: Initialize Node.js backend**
- [ ] Create `backend/` folder in project root
- [ ] Run `npm init -y` inside `backend/`
- [ ] Install dependencies: `npm install express cors dotenv mysql2 bcryptjs jsonwebtoken`
- [ ] Install dev dependencies: `npm install -D nodemon`
- [ ] Create `server.js` file with basic Express setup
- [ ] Add start scripts to `package.json`: `"start": "node server.js"`, `"dev": "nodemon server.js"`
- **Acceptance**: Server starts without errors when running `npm run dev`
- **Time Estimate**: 45 minutes

**Issue #78: Set up environment variables for backend**
- [ ] Create `.env` file in `backend/` folder
- [ ] Add variables: `PORT=5000`, `DB_HOST=localhost`, `DB_USER=root`, `DB_PASS=`, `DB_NAME=fgaweb`, `JWT_SECRET=your_jwt_secret_key`
- [ ] Create `.env.example` with same keys but empty values
- [ ] Update `.gitignore` to exclude `.env`
- [ ] Load variables in `server.js` using `require('dotenv').config()`
- **Acceptance**: Can access `process.env.PORT` in code
- **Analogy**: Writing down secret recipes in a locked drawer

**Issue #79: Configure CORS and middleware**
- [ ] Set up CORS to allow requests from `http://localhost:5173`
- [ ] Add `express.json()` middleware to parse JSON bodies
- [ ] Add `express.urlencoded({ extended: true })` for form data
- [ ] Create a test route `GET /api/test` that returns `{ message: "API is working" }`
- [ ] Test using browser or Postman
- **Acceptance**: Frontend can successfully call backend API
- **Time Estimate**: 30 minutes

---

### 1.4 Database Setup
**Issue #8: Create MySQL database and connection**
- [ ] Install MySQL locally or sign up for free cloud tier (Railway, PlanetScale)
- [ ] Create database named `fgaweb`
- [ ] Create `backend/config/db.js` file with MySQL connection pool setup
- [ ] Test connection by logging "Database Connected" on successful connection
- [ ] Export connection pool for use in other files
- **Acceptance**: Console shows "Database Connected" when server starts
- **Analogy**: Connecting the fridge to the kitchen

**Issue #9: Create database schema - Users table**
- [ ] Create `backend/database/schema.sql` file
- [ ] Write SQL to create `users` table with fields:
  - `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
  - `first_name` (VARCHAR(50))
  - `last_name` (VARCHAR(50))
  - `email` (VARCHAR(100), UNIQUE)
  - `password_hash` (VARCHAR(255))
  - `role` (ENUM: 'user', 'admin', default 'user')
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
  - `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
- [ ] Run this SQL in your MySQL client to create the table
- **Acceptance**: `users` table exists in database
- **Time Estimate**: 30 minutes

**Issue #10: Create database schema - Events table**
- [ ] Add to `schema.sql`: Create `events` table with:
  - `id`, `title`, `description`, `date`, `location`, `image_url`, `max_participants`, `registration_open` (BOOLEAN), `created_at`, `updated_at`
- [ ] Run SQL to create table
- **Acceptance**: `events` table exists in database
- **Time Estimate**: 20 minutes

**Issue #11: Create database schema - Programs table**
- [ ] Add to `schema.sql`: Create `programs` table with:
  - `id`, `name`, `description`, `age_group`, `schedule`, `price`, `is_active`, `created_at`, `updated_at`
- [ ] Run SQL
- **Acceptance**: `programs` table exists
- **Time Estimate**: 20 minutes

**Issue #12: Create database schema - Registrations table**
- [ ] Add to `schema.sql`: Create `registrations` table with:
  - `id`, `user_id` (FK to users), `event_id` (FK to events, nullable), `program_id` (FK to programs, nullable), `status` (ENUM: 'pending', 'confirmed', 'cancelled'), `created_at`
- [ ] Run SQL
- **Acceptance**: `registrations` table exists with foreign keys
- **Time Estimate**: 30 minutes

**Issue #13: Create database schema - Payments table**
- [ ] Add to `schema.sql`: Create `payments` table with:
  - `id`, `user_id` (FK), `stripe_payment_id`, `amount`, `currency`, `status`, `created_at`
- [ ] Run SQL
- **Acceptance**: `payments` table exists
- **Time Estimate**: 20 minutes

---

## 🎨 Phase 2: Core UI Components (Reusable LEGO Blocks)

### 2.1 Navigation Components
**Issue #14: Build Button component**
- [ ] Create `src/components/Button.jsx`
- [ ] Accept props: `text`, `onClick`, `variant` ('primary' | 'secondary' | 'danger')
- [ ] Style with Tailwind: primary (blue), secondary (gray), danger (red)
- [ ] Add hover effects
- [ ] Export component
- **Acceptance**: Button renders with correct colors based on variant
- **Time Estimate**: 45 minutes

**Issue #15: Build Navbar component (Desktop)**
- [ ] Create `src/components/Navbar.jsx`
- [ ] Add FGA logo (placeholder or uploaded image)
- [ ] Add links: Home, About, Programs, Events, Login
- [ ] Style with Tailwind (sticky top, shadow, background)
- [ ] Use React Router's `<Link>` component
- **Acceptance**: Navbar displays correctly on desktop (screen > 768px)
- **Time Estimate**: 1.5 hours

**Issue #16: Make Navbar responsive (Mobile)**
- [ ] Add hamburger icon (use react-icons or lucide-react)
- [ ] Create mobile menu with slide-in animation
- [ ] Hide desktop menu on mobile, show hamburger instead
- [ ] Toggle menu state with useState
- **Acceptance**: On mobile, menu collapses into hamburger and expands on click
- **Time Estimate**: 1.5 hours

**Issue #17: Build Footer component**
- [ ] Create `src/components/Footer.jsx`
- [ ] Add copyright text: "© 2025 Future Generation Academy"
- [ ] Add social media icons (Facebook, Instagram, Twitter - placeholders OK)
- [ ] Add quick links (Privacy Policy, Terms of Service - can link to "#" for now)
- [ ] Style with Tailwind (dark background, centered text)
- **Acceptance**: Footer displays at bottom of every page
- **Time Estimate**: 45 minutes

---

### 2.2 Reusable UI Components
**Issue #18: Build Card component**
- [ ] Create `src/components/Card.jsx`
- [ ] Accept props: `title`, `description`, `image`, `children`
- [ ] Style with shadow, rounded corners, hover effect
- **Acceptance**: Can wrap any content in a Card
- **Time Estimate**: 30 minutes

**Issue #19: Build Input component**
- [ ] Create `src/components/Input.jsx`
- [ ] Accept props: `type`, `placeholder`, `value`, `onChange`, `error` (for validation message)
- [ ] Show red border if error exists
- [ ] Display error message below input
- **Acceptance**: Input shows validation errors correctly
- **Time Estimate**: 45 minutes

**Issue #20: Build Loading Spinner component**
- [ ] Create `src/components/LoadingSpinner.jsx`
- [ ] Use Tailwind's animation classes or CSS keyframes
- [ ] Make it centered and reusable
- **Acceptance**: Spinner appears while data is loading
- **Time Estimate**: 20 minutes

---

## 🏠 Phase 3: Public Pages (Frontend)

### 3.1 Routing Setup
**Issue #21: Set up React Router**
- [ ] Install `react-router-dom`
- [ ] Wrap `<App />` with `<BrowserRouter>` in `main.jsx`
- [ ] Create routes in `App.jsx` for: `/`, `/about`, `/programs`, `/events`, `/events/:id`, `/login`, `/signup`, `/dashboard`
- [ ] Test navigation by clicking Navbar links
- **Acceptance**: URLs change and pages render correctly
- **Time Estimate**: 45 minutes

---

### 3.2 Home Page
**Issue #22: Build Home page layout**
- [ ] Create `src/pages/Home.jsx`
- [ ] Add hero section with background image (placeholder), title "Welcome to FGA", and CTA button "Explore Programs"
- [ ] Add "Upcoming Events" section (static for now)
- [ ] Add "About Us" preview section with short text
- **Acceptance**: Home page looks visually complete
- **Time Estimate**: 2 hours

---

### 3.3 About Page
**Issue #23: Build About page**
- [ ] Create `src/pages/About.jsx`
- [ ] Add sections: History, Mission/Vision, Coaching Staff (use placeholder data)
- [ ] Add images (placeholders)
- [ ] Make responsive
- **Acceptance**: About page displays all sections correctly
- **Time Estimate**: 1.5 hours

---

### 3.4 Events List Page
**Issue #24: Build Events list page UI (static)**
- [ ] Create `src/pages/Events.jsx`
- [ ] Display a grid of event cards (3 columns on desktop, 1 on mobile)
- [ ] Use hardcoded mock data (array of 3-4 events)
- [ ] Each card shows: image, title, date, location, "View Details" button
- **Acceptance**: Events grid displays correctly before API integration
- **Time Estimate**: 2 hours

**Issue #25: Connect Events page to backend API**
- [ ] Create `src/services/api.js` with axios instance (baseURL from .env)
- [ ] Create function `fetchEvents()` that calls `GET /api/events`
- [ ] Use `useEffect` and `useState` in `Events.jsx` to fetch and display events
- [ ] Add loading spinner while fetching
- [ ] Handle errors (show error message if API fails)
- **Acceptance**: Events are fetched from backend and displayed
- **Time Estimate**: 1.5 hours

---

### 3.5 Event Detail Page
**Issue #26: Build Event Detail page**
- [ ] Create `src/pages/EventDetail.jsx`
- [ ] Get `id` from URL params using `useParams()`
- [ ] Fetch single event data: `GET /api/events/:id`
- [ ] Display full details: image, title, description, date, location, max participants
- [ ] Add "Register" button (disabled if not logged in)
- **Acceptance**: Clicking an event card opens its detail page
- **Time Estimate**: 2 hours

---

### 3.6 Programs Page
**Issue #27: Build Programs list page**
- [ ] Create `src/pages/Programs.jsx`
- [ ] Similar to Events page: grid of program cards
- [ ] Display: name, age group, schedule, price
- [ ] Add "Register" button on each card
- **Acceptance**: Programs display correctly
- **Time Estimate**: 1.5 hours

---

## 🔐 Phase 4: Authentication (Full Stack)

### 4.1 Backend - Auth Routes
**Issue #28: Create User registration endpoint**
- [ ] Create `backend/routes/authRoutes.js`
- [ ] Create `POST /api/auth/register` route
- [ ] Validate: email format, password length (min 6 chars), required fields
- [ ] Hash password using `bcryptjs`
- [ ] Insert user into `users` table
- [ ] Return success message (don't return password)
- **Acceptance**: Can register a new user via Postman
- **Time Estimate**: 2 hours

**Issue #29: Create User login endpoint**
- [ ] Create `POST /api/auth/login` route
- [ ] Find user by email
- [ ] Compare password hash using `bcryptjs.compare()`
- [ ] Generate JWT token with payload: `{ id, email, role }`
- [ ] Return token and user info (no password)
- **Acceptance**: Can login and receive JWT token
- **Time Estimate**: 1.5 hours

**Issue #30: Create JWT verification middleware**
- [ ] Create `backend/middleware/authMiddleware.js`
- [ ] Extract token from `Authorization` header
- [ ] Verify token using `jsonwebtoken.verify()`
- [ ] Attach `req.user` with decoded data
- [ ] Return 401 if token is invalid
- **Acceptance**: Protected routes reject requests without valid token
- **Time Estimate**: 1 hour

---

### 4.2 Frontend - Auth UI
**Issue #31: Build Signup page**
- [ ] Create `src/pages/Signup.jsx`
- [ ] Form fields: First Name, Last Name, Email, Password, Confirm Password
- [ ] Validate: password match, email format
- [ ] On submit, call `POST /api/auth/register`
- [ ] Show success message and redirect to login
- **Acceptance**: New users can sign up successfully
- **Time Estimate**: 2 hours

**Issue #32: Build Login page**
- [ ] Create `src/pages/Login.jsx`
- [ ] Form fields: Email, Password
- [ ] On submit, call `POST /api/auth/login`
- [ ] Store token in `localStorage`
- [ ] Redirect to `/dashboard` on success
- **Acceptance**: Users can log in and token is saved
- **Time Estimate**: 1.5 hours

**Issue #33: Create AuthContext for global auth state**
- [ ] Create `src/context/AuthContext.jsx`
- [ ] Store: `user`, `token`, `isAuthenticated`
- [ ] Functions: `login()`, `logout()`, `checkAuth()`
- [ ] Wrap app with `<AuthProvider>`
- **Acceptance**: Any component can access auth state
- **Time Estimate**: 1.5 hours

**Issue #34: Update Navbar to show user status**
- [ ] If logged in, show "Dashboard" and "Logout" links
- [ ] If logged out, show "Login" and "Signup" links
- [ ] Use `useContext(AuthContext)` to check login status
- **Acceptance**: Navbar updates based on login state
- **Time Estimate**: 45 minutes

**Issue #35: Create protected route wrapper**
- [ ] Create `src/components/ProtectedRoute.jsx`
- [ ] Check if user is authenticated
- [ ] If not, redirect to `/login`
- [ ] Wrap `/dashboard` route with this component
- **Acceptance**: Unauthenticated users cannot access dashboard
- **Time Estimate**: 1 hour

---

## 🏢 Phase 5: Event & Program Management (Backend)

### 5.1 Events API
**Issue #36: Create GET /api/events endpoint**
- [ ] Create `backend/routes/eventRoutes.js`
- [ ] Create `backend/controllers/eventController.js`
- [ ] Fetch all events from database (sorted by date DESC)
- [ ] Return JSON array
- **Acceptance**: Frontend can fetch and display events
- **Time Estimate**: 1 hour

**Issue #37: Create GET /api/events/:id endpoint**
- [ ] Fetch single event by ID
- [ ] Return 404 if not found
- **Acceptance**: Event detail page works
- **Time Estimate**: 30 minutes

**Issue #38: Create POST /api/events endpoint (Admin only)**
- [ ] Protect route with `authMiddleware` and check `role === 'admin'`
- [ ] Accept: title, description, date, location, image_url, max_participants
- [ ] Insert into database
- **Acceptance**: Admins can create events via API
- **Time Estimate**: 1.5 hours

**Issue #39: Create PUT /api/events/:id endpoint (Admin only)**
- [ ] Update event by ID
- [ ] Validate ownership or admin role
- **Acceptance**: Admins can edit events
- **Time Estimate**: 1 hour

**Issue #40: Create DELETE /api/events/:id endpoint (Admin only)**
- [ ] Delete event from database
- [ ] Check admin role
- **Acceptance**: Admins can delete events
- **Time Estimate**: 45 minutes

---

### 5.2 Programs API
**Issue #41: Create Programs CRUD endpoints**
- [ ] Create routes: `GET /api/programs`, `GET /api/programs/:id`, `POST /api/programs`, `PUT /api/programs/:id`, `DELETE /api/programs/:id`
- [ ] Follow same pattern as Events API
- **Acceptance**: All program operations work
- **Time Estimate**: 3 hours

---

## 📝 Phase 6: Registration System

### 6.1 Backend - Registration API
**Issue #42: Create POST /api/register/event endpoint**
- [ ] Require authentication (user must be logged in)
- [ ] Accept: `event_id`
- [ ] Insert into `registrations` table
- [ ] Check if event is full (compare registered count to max_participants)
- [ ] Return success or "Event Full" error
- **Acceptance**: Users can register for events
- **Time Estimate**: 2 hours

**Issue #43: Create POST /api/register/program endpoint**
- [ ] Similar to event registration but for programs
- **Acceptance**: Users can register for programs
- **Time Estimate**: 1.5 hours

**Issue #44: Create GET /api/registrations/me endpoint**
- [ ] Fetch all registrations for logged-in user
- [ ] Return with event/program details (JOIN query)
- **Acceptance**: Users can see their registrations
- **Time Estimate**: 1.5 hours

---

### 6.2 Frontend - Registration UI
**Issue #45: Add Register button to Event Detail page**
- [ ] Check if user is logged in
- [ ] On click, call `POST /api/register/event`
- [ ] Show success/error message
- [ ] Disable button if already registered
- **Acceptance**: Users can register for events from detail page
- **Time Estimate**: 1.5 hours

**Issue #46: Build User Dashboard page**
- [ ] Create `src/pages/Dashboard.jsx`
- [ ] Display user info (name, email)
- [ ] Show "My Registrations" section
- [ ] Fetch and display user's registrations
- **Acceptance**: Users see their registered events/programs
- **Time Estimate**: 2 hours

---

## 💳 Phase 7: Payment Integration (Stripe)

### 7.1 Stripe Setup
**Issue #47: Set up Stripe account and get API keys**
- [ ] Sign up for Stripe
- [ ] Get Test Mode keys (Publishable and Secret)
- [ ] Add to backend `.env`: `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Add to frontend `.env`: `VITE_STRIPE_PUBLIC_KEY=pk_test_...`
- **Acceptance**: Keys are stored securely
- **Time Estimate**: 30 minutes

**Issue #48: Install Stripe SDKs**
- [ ] Backend: `npm install stripe`
- [ ] Frontend: `npm install @stripe/stripe-js @stripe/react-stripe-js`
- **Acceptance**: Packages installed without errors
- **Time Estimate**: 15 minutes

---

### 7.2 Backend - Payment Endpoints
**Issue #49: Create Stripe checkout session endpoint**
- [ ] Create `POST /api/payments/create-checkout-session`
- [ ] Accept: `amount`, `currency`, `user_id`
- [ ] Create Stripe checkout session with success/cancel URLs
- [ ] Return session ID
- **Acceptance**: Endpoint returns valid session ID
- **Time Estimate**: 2 hours

**Issue #50: Create Stripe webhook handler**
- [ ] Create `POST /api/webhooks/stripe`
- [ ] Use raw body parser (Stripe signature verification requires raw body)
- [ ] Handle event: `checkout.session.completed`
- [ ] Insert payment record into `payments` table
- [ ] Update user subscription status
- **Acceptance**: Webhook correctly processes test payments
- **Time Estimate**: 2.5 hours

---

### 7.3 Frontend - Payment UI
**Issue #51: Build Membership/Subscription page**
- [ ] Create `src/pages/Membership.jsx`
- [ ] Display subscription plans (monthly/yearly)
- [ ] Add "Subscribe" button
- [ ] On click, call backend to create checkout session
- [ ] Redirect to Stripe checkout page
- **Acceptance**: Users can click Subscribe and see Stripe checkout
- **Time Estimate**: 2 hours

**Issue #52: Build Payment Success page**
- [ ] Create `src/pages/PaymentSuccess.jsx`
- [ ] Display success message
- [ ] Show transaction ID
- [ ] Link back to Dashboard
- **Acceptance**: After payment, user sees success page
- **Time Estimate**: 45 minutes

**Issue #53: Build Payment Cancel page**
- [ ] Create `src/pages/PaymentCancel.jsx`
- [ ] Display "Payment cancelled" message
- [ ] Link back to Membership page
- **Acceptance**: If user cancels, they see this page
- **Time Estimate**: 30 minutes

---

## 🛠️ Phase 8: Admin Panel

### 8.1 Admin Dashboard UI
**Issue #54: Create Admin Dashboard layout**
- [ ] Create `src/pages/admin/AdminDashboard.jsx`
- [ ] Protected route: only accessible if `role === 'admin'`
- [ ] Add sidebar with links: Dashboard, Events, Programs, Registrations, Users
- **Acceptance**: Admin sees dashboard (regular users get 403)
- **Time Estimate**: 2 hours

**Issue #55: Build Events Management page (Admin)**
- [ ] Create `src/pages/admin/EventsManager.jsx`
- [ ] Display table of all events
- [ ] Add "Create Event" button that opens a form
- [ ] Add Edit/Delete buttons for each row
- **Acceptance**: Admins can create, edit, and delete events
- **Time Estimate**: 3 hours

**Issue #56: Build Programs Management page (Admin)**
- [ ] Similar to Events Manager but for programs
- **Acceptance**: Admins can manage programs
- **Time Estimate**: 2.5 hours

**Issue #57: Build Registrations View (Admin)**
- [ ] Create `src/pages/admin/RegistrationsManager.jsx`
- [ ] Display all registrations with user details
- [ ] Add filters: by event, by program, by status
- [ ] Add "Export to CSV" button
- **Acceptance**: Admins can view and export registrations
- **Time Estimate**: 3 hours

**Issue #58: Build Users Management page (Admin)**
- [ ] Create `src/pages/admin/UsersManager.jsx`
- [ ] Display all users in a table
- [ ] Allow role changes (user ↔ admin)
- [ ] Add search functionality
- **Acceptance**: Admins can manage users
- **Time Estimate**: 2.5 hours

---

## 🚀 Phase 9: Deployment & Production

### 9.1 Backend Deployment
**Issue #59: Prepare backend for production**
- [ ] Remove all `console.log()` statements (or use proper logger like Winston)
- [ ] Add error handling middleware
- [ ] Set up environment detection (development vs production)
- [ ] Ensure all routes return proper HTTP status codes
- **Acceptance**: Backend is production-ready
- **Time Estimate**: 2 hours

**Issue #60: Deploy backend to Railway/Render**
- [ ] Sign up for Railway or Render
- [ ] Connect GitHub repository
- [ ] Add all environment variables in dashboard
- [ ] Deploy backend
- [ ] Test live API endpoint
- **Acceptance**: Backend is live and accessible
- **Time Estimate**: 1.5 hours

**Issue #61: Set up production MySQL database**
- [ ] Create production database on Railway/PlanetScale
- [ ] Run `schema.sql` on production database
- [ ] Update `DB_HOST`, `DB_USER`, `DB_PASS` in production environment
- **Acceptance**: Production database is live and connected
- **Time Estimate**: 1 hour

---

### 9.2 Frontend Deployment
**Issue #62: Prepare frontend for production**
- [ ] Update `VITE_API_URL` to point to production backend
- [ ] Remove debug code and console.logs
- [ ] Test build: `npm run build`
- [ ] Verify `dist/` folder is generated
- **Acceptance**: Frontend builds without errors
- **Time Estimate**: 1 hour

**Issue #63: Deploy frontend to Vercel/Netlify**
- [ ] Sign up for Vercel or Netlify
- [ ] Import GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variables (VITE_API_URL, VITE_STRIPE_PUBLIC_KEY)
- [ ] Deploy
- **Acceptance**: Frontend is live at a public URL
- **Time Estimate**: 1 hour

**Issue #64: Connect custom domain (Optional)**
- [ ] Purchase domain (client responsibility)
- [ ] Configure DNS settings to point to Vercel/Netlify
- [ ] Verify SSL certificate is active
- **Acceptance**: Site is accessible via custom domain
- **Time Estimate**: 30 minutes (depends on DNS propagation)

---

## 🧪 Phase 10: Testing & QA

### 10.1 Manual Testing
**Issue #65: Test user registration flow**
- [ ] Create a new account
- [ ] Verify email validation works
- [ ] Verify password requirements are enforced
- [ ] Check that user is redirected to login after signup
- **Acceptance**: Registration flow works end-to-end
- **Time Estimate**: 30 minutes

**Issue #66: Test login flow**
- [ ] Login with valid credentials
- [ ] Try invalid credentials and verify error
- [ ] Check that token is saved
- [ ] Verify Navbar updates after login
- **Acceptance**: Login flow works correctly
- **Time Estimate**: 30 minutes

**Issue #67: Test event registration**
- [ ] Log in as a user
- [ ] Register for an event
- [ ] Verify registration appears in dashboard
- [ ] Try registering for the same event again (should fail)
- **Acceptance**: Event registration works
- **Time Estimate**: 30 minutes

**Issue #68: Test payment flow**
- [ ] Go to Membership page
- [ ] Click Subscribe
- [ ] Complete Stripe checkout (use test card: 4242 4242 4242 4242)
- [ ] Verify payment record is created
- [ ] Check webhook is triggered
- **Acceptance**: Payment flow works end-to-end
- **Time Estimate**: 45 minutes

**Issue #69: Test admin panel**
- [ ] Log in as admin
- [ ] Create a new event
- [ ] Edit an existing event
- [ ] Delete an event
- [ ] Verify changes appear on frontend
- **Acceptance**: Admin can manage content
- **Time Estimate**: 1 hour

---

### 10.2 Bug Fixes & Polish
**Issue #70: Fix responsive design issues**
- [ ] Test all pages on mobile (iPhone SE, iPhone 12, iPad)
- [ ] Test on desktop (1920x1080, 1366x768)
- [ ] Fix any layout breaks
- **Acceptance**: Site looks good on all screen sizes
- **Time Estimate**: 2 hours

**Issue #71: Add loading states**
- [ ] Ensure all API calls show loading spinner
- [ ] Add skeleton loaders for lists
- **Acceptance**: Users never see blank screens
- **Time Estimate**: 1.5 hours

**Issue #72: Add error handling**
- [ ] Catch all API errors and display user-friendly messages
- [ ] Add 404 page for invalid routes
- [ ] Add 500 error page for server errors
- **Acceptance**: Errors are handled gracefully
- **Time Estimate**: 2 hours

---

## 📚 Phase 11: Documentation & Handover

**Issue #73: Write API documentation**
- [ ] Document all endpoints in a README or Postman collection
- [ ] Include example requests and responses
- **Acceptance**: Another developer can use the API
- **Time Estimate**: 2 hours

**Issue #74: Write deployment guide**
- [ ] Document how to deploy backend and frontend
- [ ] Include environment variables list
- **Acceptance**: Client can redeploy if needed
- **Time Estimate**: 1.5 hours

**Issue #75: Create user manual**
- [ ] Write guide for FGA staff on how to use admin panel
- [ ] Include screenshots
- **Acceptance**: Non-technical staff can manage content
- **Time Estimate**: 2 hours

---

## 📊 Summary

**Total Issues**: 83
**Estimated Total Time**: ~130-150 hours (3-4 weeks for 2-3 junior developers working full-time)

**Milestones**:
- Phase 1-2: Project Setup (2 weeks)
- Phase 3-6: Core Features (2 weeks)
- Phase 7-8: Payments & Admin (1.5 weeks)
- Phase 9-11: Deployment & Polish (1 week)

Each task is **self-contained** and can be assigned to different developers or completed sequentially by one person.

