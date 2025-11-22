# Project Tasks & Issues
_Micro-level tasks designed for junior developers to learn while building._

## Phase 1: UI/UX & Design (Frontend Foundation)
_Goal: Set up the visual shop and learn React basics._

### 1.1. Environment Setup
- [ ] **Task**: Install Node.js, VS Code (or Cursor), and Git.
- [ ] **Task**: Clone the repository and create a new branch `feat/setup-frontend`.
- [ ] **Task**: Initialize a React project using Vite (`npm create vite@latest frontend`).
- [ ] **Description**: Get the "Kitchen" ready. Ensure you can run `npm run dev` and see the default React page.

### 1.2. Project Structure & Cleanup
- [ ] **Task**: Clean up the default Vite boilerplate (remove `App.css`, standard `App.jsx`).
- [ ] **Task**: Create folder structure: `components/`, `pages/`, `assets/`, `context/`.
- [ ] **Description**: Organize the "pantry". A clean workspace prevents confusion later.

### 1.3. Component Library: The Basics (LEGO Blocks)
- [ ] **Task**: Create a generic `<Button />` component.
    - *Requirement*: Accepts `text`, `onClick`, and `variant` (primary/secondary) props.
- [ ] **Task**: Create a `<Navbar />` component.
    - *Requirement*: Responsive (hamburger menu on mobile), contains links to Home, About, Events.
- [ ] **Task**: Create a `<Footer />` component.
    - *Requirement*: Copyright info, social media links.
- [ ] **Description**: Build your reusable tools first. Don't build a whole page at once; build the parts.

### 1.4. Routing Implementation
- [ ] **Task**: Install `react-router-dom`.
- [ ] **Task**: Set up `<BrowserRouter>` in `main.jsx`.
- [ ] **Task**: Create placeholder pages: `Home.jsx`, `About.jsx`, `Events.jsx`.
- [ ] **Task**: Configure routes in `App.jsx` to navigate between these pages.
- [ ] **Description**: Learn how to navigate between "rooms" in your app without reloading the page.

### 1.5. Styling with Tailwind CSS
- [ ] **Task**: Install and configure Tailwind CSS.
- [ ] **Task**: Apply global styles (font family, background colors) in `index.css`.
- [ ] **Task**: Style the `<Navbar />` using Tailwind classes.
- [ ] **Description**: Learn utility-first CSS. It's like painting by numbers—fast and consistent.

---

## Phase 2: Backend Systems (The Kitchen)
_Goal: Build the server that powers the application._

### 2.1. Server Initialization
- [ ] **Task**: Create `backend/` folder and run `npm init -y`.
- [ ] **Task**: Install `express`, `cors`, `dotenv`, `nodemon`.
- [ ] **Task**: Create `server.js` and set up a basic Express server listening on port 5000.
- [ ] **Description**: Open the restaurant kitchen. Ensure the lights are on (server runs).

### 2.2. Database Connection (MySQL)
- [ ] **Task**: Set up a local MySQL database (or use a free cloud tier).
- [ ] **Task**: Create a `config/db.js` file to handle connection logic using `mysql2` or `sequelize`/`prisma`.
- [ ] **Task**: Verify connection: Log "Database Connected" to the console on server start.
- [ ] **Description**: Connect the kitchen to the pantry.

### 2.3. API Endpoints: Events
- [ ] **Task**: Create a mock data array for events in `controllers/eventController.js`.
- [ ] **Task**: Create route `GET /api/events` to return the list of events.
- [ ] **Task**: Create route `GET /api/events/:id` to return a single event by ID.
- [ ] **Task**: Test these endpoints using Postman or Thunder Client.
- [ ] **Description**: Create the "Menu". Define what customers can order.

### 2.4. Authentication: User Model
- [ ] **Task**: Design the `User` table schema (id, email, password_hash, role).
- [ ] **Task**: Create a registration route `POST /api/auth/register`.
    - *Requirement*: Validate email format. Hash password using `bcrypt`.
- [ ] **Task**: Create a login route `POST /api/auth/login`.
    - *Requirement*: Verify password, generate a JWT token.
- [ ] **Description**: Learn security. Verify the "membership card" before letting people in.

---

## Phase 3: Integration (The Waiter)
_Goal: Connect Frontend and Backend._

### 3.1. API Consumption
- [ ] **Task**: Install `axios` in the frontend.
- [ ] **Task**: Create an `api.js` service file to manage base URL and configurations.
- [ ] **Task**: Fetch the event list in `Events.jsx` using `useEffect` and display them.
- [ ] **Description**: Send the waiter to the kitchen and put the food on the table.

### 3.2. Authentication Flow
- [ ] **Task**: Create a `Login.jsx` form.
- [ ] **Task**: On submit, send credentials to `POST /api/auth/login`.
- [ ] **Task**: Store the received JWT token in `localStorage`.
- [ ] **Task**: Update the Navbar to show "Logout" instead of "Login" when a token exists.
- [ ] **Description**: Manage the user's session. Remember who they are.

---

## Phase 4: Payment Gateway (Stripe)
_Goal: Process real money for subscriptions._

### 4.1. Stripe Setup
- [ ] **Task**: Create a Stripe account and get Test API Keys.
- [ ] **Task**: Install `stripe` (backend) and `@stripe/react-stripe-js` (frontend).
- [ ] **Description**: Set up the cash register.

### 4.2. Checkout Flow
- [ ] **Task**: Create a backend route `POST /api/create-checkout-session`.
- [ ] **Task**: Create a frontend button "Subscribe Now" that calls this endpoint.
- [ ] **Task**: Handle the redirect to Stripe's hosted checkout page.
- [ ] **Description**: The transaction process. Handing over the bill.

---

## Phase 5: Deployment (Grand Opening)
_Goal: Go live._

### 5.1. Backend Deployment
- [ ] **Task**: Push code to GitHub.
- [ ] **Task**: Create a project on Railway/Render and connect the repo.
- [ ] **Task**: Set environment variables (DB credentials, JWT secret) in the dashboard.
- [ ] **Description**: Moving the kitchen to a commercial building.

### 5.2. Frontend Deployment
- [ ] **Task**: Create a project on Vercel/Netlify.
- [ ] **Task**: Update the API URL in frontend to point to the live backend (not localhost).
- [ ] **Task**: Deploy and verify the live site works.
- [ ] **Description**: Opening the front doors to the public.

