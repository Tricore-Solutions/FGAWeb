# Junior Developer Learning Plan: Future Generation Academy (FGA) Website

**Objective**: This guide will take you from "Zero" to "Full Stack Hero". You will build the real FGA website while learning the core concepts of React and Express.

**Philosophy**: We use **analogies** to explain the *why*, and **code** to show you the *how*.

---

## 1. Development Environment Setup: "Setting Up Your Kitchen"

Before we can cook (code), we need a kitchen (environment) and tools.

### Concepts & Analogies
*   **Node.js**: Think of this as the **Kitchen**. It's the environment where your JavaScript code lives and runs outside of a browser. Without it, we can't run our backend server.
*   **NPM (Node Package Manager)**: This is your **Grocery Store**. Instead of growing your own wheat (writing every line of code from scratch), you buy flour (download packages like `react` or `express`) to build your meal faster.
*   **Cursor/IDE**: This is your **Chef’s Station**. It’s where you chop ingredients and assemble dishes. It helps you by highlighting errors (like a sous-chef warning you the pan is too hot).
*   **Git**: This is your **Time Machine / Save Game**. If you mess up a recipe, Git lets you go back to exactly how things were yesterday.

### 🛠️ Practical Steps
1.  **Install Node.js**: Download the LTS version. This installs both the Kitchen (Node) and the Grocery Store (NPM).
2.  **Install VS Code**: Download and install the editor.
    *   *Why?* It’s the industry standard and makes reading code much easier.
3.  **Install Git**: Set it up on your machine.
4.  **Clone the FGA Repository**:
    ```bash
    git clone <repo-url>
    cd FGAWeb
    ```
    *   *Why?* This copies the project foundation to your local computer so you can work on it without breaking the main version.

---

## 2. Frontend with React: "The Dining Room & LEGOs"

The Frontend is what the FGA parents and athletes see. It needs to look good and be interactive.

### Concepts & Analogies
*   **React Components**: Think of these as **LEGO blocks**. Instead of building a whole castle in one piece, you build a `Wall` block, a `Tower` block, and a `Gate` block. Then you snap them together.
    *   *FGA Example*: We will build an `<EventCard />` component. We build it once, and reuse it for every tournament on the list.
*   **Props (Properties)**: These are **Instructions** you pass to a component.
    *   *Analogy*: Imagine a "Sandwich" component. You pass it props like `type="turkey"` or `cheese="cheddar"`. The sandwich maker (component) reads these instructions and builds the specific sandwich you asked for.
*   **State**: This is the **Short-term Memory** of a component.
    *   *Analogy*: Imagine a counter asking "How many guests?". The number changes as you click + or -. That number is stored in "State". If you refresh the page, it resets (unless we save it elsewhere).

### 🛠️ Practical Steps
1.  **Create the Project** (if not already there): `npm create vite@latest frontend`.
2.  **Build Your First Component**:
    *   Create `components/Navbar.jsx`.
    *   *Task*: Make a simple bar with the "FGA" logo and links.
3.  **Use Props**:
    *   Create `components/Button.jsx`.
    *   Make it accept a `label` prop so we can use `<Button label="Login" />` and `<Button label="Register" />`.

---

## 3. Backend with Express: "The Kitchen & The Chefs"

The Backend is hidden from the user. It handles data, security, and logic.

### Concepts & Analogies
*   **Express Server**: This is the **Head Chef**. It listens for orders coming from the waiters (Frontend) and delegates tasks.
*   **Routes**: These are **Service Counters** or **Stations**.
    *   *Analogy*: In a bank, you have different counters. One for "Deposits" (`POST /deposit`), one for "Withdrawals" (`POST /withdraw`). You can't ask for a withdrawal at the deposit counter.
    *   *FGA Example*:
        *   `GET /api/events` = "Give me the list of upcoming tournaments."
        *   `POST /api/login` = "Here are my credentials, let me in."
*   **Middleware**: These are the **Security Guards / Health Inspectors**.
    *   *Analogy*: Before an order reaches the kitchen, a guard checks "Is this customer wearing a shirt?" (Is the user logged in?). If not, they turn them away before the chef even knows.

### 🛠️ Practical Steps
1.  **Initialize Backend**: Create a `backend` folder and run `npm init -y`.
2.  **Install Express**: `npm install express`.
3.  **Create a Simple Server**:
    *   Create `server.js`. Write code to listen on port 5000.
    *   *Goal*: When you visit `http://localhost:5000`, it should say "Welcome to FGA API".
4.  **Create Your First Route**:
    *   Make a route `GET /api/test` that responds with `{ message: "Backend is working!" }`.

---

## 4. Integration: "The Waiter"

Now we connect the Dining Room (React) to the Kitchen (Express).

### Concepts & Analogies
*   **API (Application Programming Interface)**: The **Waiter**.
    *   *Analogy*: The customer (React) cannot walk into the kitchen (Database) and grab a burger. They must tell the Waiter (API). The Waiter takes the order to the Kitchen, waits for the food, and brings it back to the table.
*   **JSON**: The **Order Ticket**. It’s the language the Waiter uses to write down orders so both the Customer and the Kitchen understand.

### 🛠️ Practical Steps
1.  **Install Axios in Frontend**: `npm install axios` (This gives our React app the ability to "speak" to the Waiter).
2.  **Fetch Data**:
    *   In your React `App.jsx`, use `useEffect` (a React tool to run code when the page loads).
    *   Call the backend: `axios.get('http://localhost:5000/api/test')`.
    *   Display the message on the screen.
    *   *Success*: If you see "Backend is working!" on your React page, you have successfully connected the two worlds!

---

## 5. Building Features Step-by-Step

Let's build the "Events Page" for FGA.

### Step A: The Database (The Pantry)
*   *Analogy*: The fridge where raw ingredients (Data) are stored.
*   **Task**: Create a mock list of events in a file (or database) in the backend.
    ```json
    [
      { "id": 1, "name": "Summer Cup", "date": "2023-07-15" },
      { "id": 2, "name": "Winter League", "date": "2023-12-01" }
    ]
    ```

### Step B: The Backend Route (The Station)
*   **Task**: Create `GET /api/events`.
*   **Logic**: When this URL is visited, the server should look in the Pantry (Database), grab the list, and send it back as JSON.

### Step C: The Frontend Display (The Menu)
*   **Task**: In React, create an `EventsPage.jsx`.
*   **Logic**:
    1.  Wait for the component to load.
    2.  Send the "Waiter" to get the events.
    3.  Save the events in "State" (Memory).
    4.  Use the `.map()` function (like a cloning machine) to create an `<EventCard />` for each item in the list.

---

## 6. Deployment: "Grand Opening"

Your app works on your laptop (Home Kitchen), now let's move it to the Internet (Restaurant Building).

### Concepts & Analogies
*   **Deployment**: Opening your shop to the public.
*   **Environment Variables**: The **Secret Recipes**. things like API Keys or Database Passwords that you don't want to print on the public menu. We store these safely in the server settings.

### 🛠️ Practical Steps
1.  **Frontend (Vercel/Netlify)**:
    *   Connect your GitHub repo.
    *   Vercel builds your "LEGO castle" and puts it on a public URL (e.g., `fga-web.vercel.app`).
2.  **Backend (Railway/Render)**:
    *   Upload your server code.
    *   It runs 24/7 so users can request data anytime.
3.  **Connect Them**:
    *   Tell the Frontend (Vercel) that the Backend lives at the new Railway URL, not `localhost`.

---

**Next Steps**:
Start with Phase 1. Don't rush. If you get stuck, remember the analogies: "Is the Waiter lost?" (Network Error), "Did we run out of ingredients?" (Database Empty), or "Did the Chef misunderstand the order?" (Backend Logic Error).

**Good luck, Team FGA!**

