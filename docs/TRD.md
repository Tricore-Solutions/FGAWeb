# Technical Requirements Document (TRD)  
_For Future Generation Academy Website_

---

## 1. Introduction
This TRD defines the technical architecture, modules, environments, and standards for the FGA website project.  
The stack is intentionally selected to be beginner-friendly while fully scalable.

---

## 2. System Architecture

```
Frontend (React + Vite) → REST API (Express) → MySQL Database
↓
Stripe Payment Gateway
```

### Hosting Architecture
- **Frontend:** Vercel or Netlify  
- **Backend:** Railway or Render  
- **Database:** MySQL (Railway or client hosting)  
- **Domain:** Points to frontend entry  
- **SSL:** Managed by hosting platform  

---

## 3. Frontend Requirements

### 3.1 Framework & Tooling
- React (Vite build tool)
- React Router for navigation
- TailwindCSS for styling
- Axios for API communication

### 3.2 Component Structure

```
/components
/pages
/context
/services
/hooks
/assets
```

### 3.3 Routing Requirements (React Router)
- `/` — Home  
- `/about`  
- `/programs`  
- `/events`  
- `/events/:id`  
- `/register`  
- `/login`  
- `/dashboard` **(protected route)**  

### 3.4 State Management
- React Context API (AuthContext, UserContext)
- LocalStorage for token persistence
- Optional: Redux Toolkit if needed

### 3.5 UI Requirements
- Fully responsive  
- Reusable UI components  
- Loading states & skeletons  
- Form validation using Zod/Yup  
- TailwindCSS utilities for layout  

---

## 4. Backend Requirements

### 4.1 Framework
- Node.js  
- Express.js  

### 4.2 REST API Structure  
All responses follow:

```json
{
  "success": boolean,
  "message": string,
  "data": {},
  "code": string,
  "details": {}
}
```

### 4.3 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | Login & auth token |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Event details |
| POST | `/api/register/event` | Register user for event |
| POST | `/api/payments/stripe/create-checkout` | Create Stripe checkout session |
| POST | `/api/webhooks/stripe` | Stripe webhook |
| GET | `/api/admin/events` | Admin event list |
| POST | `/api/admin/events` | Create event |
| PUT | `/api/admin/events/:id` | Edit event |
| DELETE | `/api/admin/events/:id` | Delete event |

### 4.4 Security Requirements
- JWT authentication (access tokens)  
- bcrypt password hashing  
- Helmet middleware  
- CORS configured to frontend domain  
- Request rate limiting  
- Validation with Joi/Zod  
- HTTPS enforced in production  

### 4.5 Error Handling  
Unified format:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 5. Database Requirements (MySQL)

### 5.1 Required Tables
- users  
- events  
- programs  
- registrations  
- payments  
- subscriptions  
- admins  

### 5.2 Sample Table Schema: `users`

```sql
id (INT, PK, AUTO)
first_name (VARCHAR)
last_name (VARCHAR)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
role (ENUM: 'user', 'admin')
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### 5.3 Relationships
- A user can have many registrations  
- An event can have many registrants  
- A user can have multiple subscription/payment records  

### 5.4 ORM (Optional)
- Prisma or Sequelize is allowed (Prisma recommended for juniors)

---

## 6. Payment Gateway Requirements (Stripe)

### 6.1 Stripe Checkout
- Stripe Checkout Session for membership subscriptions  
- Success + Cancel URLs handled on frontend  
- Backend verifies payment via webhooks  

### 6.2 Required Stripe Features
- Checkout Session or Payment Intent  
- Customer creation  
- Webhook event listeners  
- Automatic email receipts (Stripe handles)

### 6.3 Webhook Requirements
- Must use raw body middleware  
- Must use Stripe signature validation  
- Supported events:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`

### 6.4 Security
- Webhook signature required  
- HTTPS mandatory  
- Test mode enabled during staging  

---

## 7. Hosting & Deployment Requirements

### 7.1 Frontend (Vercel/Netlify)
- Auto deployment on git push  
- Environment variables stored via dashboard  
- Build command: `npm run build`  
- Output dir: `dist/`

### 7.2 Backend (Railway/Render)
- Auto deploy from GitHub  
- Logs accessible via dashboard  
- `index.js` starts server  
- PM2 optional but not required  

### 7.3 Database (MySQL)
- Hosted on Railway or client server  
- Must enable SSL  
- Prisma migrations run via CI/CD  

---

## 8. Environment Variables

### Frontend

```env
VITE_API_URL=
VITE_STRIPE_PUBLIC_KEY=
```

### Backend `.env`

```env
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CORS_ORIGIN=
```

---

## 9. Version Control Requirements

### 9.1 Git Workflow
- `main` → production  
- `dev` → staging  
- `feature/<name>` → feature branches  

### 9.2 Pull Request Rules
- PR required  
- At least 1 review  
- Linked issue (if applicable)  

### 9.3 Commit Standard
Follow **Conventional Commits**:

Examples:
- `feat: add event registration API`  
- `fix: correct MySQL connection pooling`  
- `docs: update API readme`  

---

## 10. Testing Requirements

### 10.1 Frontend Tests
- Form validation  
- API integration tests  
- Component rendering tests  

### 10.2 Backend Tests
- Unit tests for controllers  
- Integration tests for endpoints  
- All auth flows verified  

### 10.3 Stripe Testing
- Test mode enabled  
- Use Stripe test cards  
- Webhook tests with CLI (`stripe listen`)  

---

## 11. Performance Requirements
- API responses under **400 ms**  
- First Contentful Paint under **2 seconds**  
- Lazy loading for images  
- GZIP or Brotli compression enabled  

---

## 12. Acceptance Criteria
- All APIs functional and documented  
- Frontend pages complete & responsive  
- Admin dashboard fully functional  
- Stripe payments working end-to-end  
- Database integrated with correct schema  
- No critical or major bugs  
- Passed QA testing  
- Deployment completed on all environments