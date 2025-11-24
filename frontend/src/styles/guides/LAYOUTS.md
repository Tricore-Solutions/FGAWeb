# Layout Patterns

This guide documents common page layout patterns used throughout the Future Generation Academy (FGA) website. Each layout is designed for specific use cases and follows the design system's spacing, colors, and typography tokens.

FGA is a youth sports training institution offering Football (soccer) programs, events & tournaments, membership subscriptions, and registration services. The website serves three main user types: **Parents** (register children, pay subscriptions), **Athletes** (view events, check status), and **FGA Administrators** (manage events, registrations, content).

## When to Use Each Layout

| Layout Pattern | Use Case | FGA Example Pages |
|----------------|----------|-------------------|
| **Full-width Hero + Content Grid** | Marketing pages, landing pages, program showcases | Homepage, About Page, Programs Page |
| **Two-column Sidebar** | Admin panels, dashboards, settings pages | Admin Dashboard, Event Management, Registration Management |
| **Centered Card** | Authentication, forms, focused interactions | Login, Signup, Password Reset, Program Registration Form |
| **Table Layout** | Data-heavy pages, lists, admin tables | Events List, Registrations List, Membership Management, Payment Records |

---

## Full-width Hero + Content Grid

### Description
A full-width hero section at the top followed by a content grid. Ideal for marketing pages, landing pages, and feature showcases where you want to make a strong first impression.

### When to Use
- **FGA Homepage**: Showcase academy, featured tournaments, program highlights
- **About Page**: History, mission, achievements, coaching staff
- **Programs Page**: Display Football (soccer) programs with registration CTAs
- **Marketing/Public Pages**: Pages that need strong visual impact for parents and athletes

### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│              ┌───────────────────────┐                   │
│              │                       │                   │
│              │    Hero Section       │                   │
│              │    (Full Width)       │                   │
│              │                       │                   │
│              └───────────────────────┘                   │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │                  │  │                  │             │
│  │   Text Content   │  │                  │             │
│  │   (Left Side)    │  │   Image/Photo    │             │
│  │                  │  │   (Right Side)   │             │
│  │   - Heading      │  │                  │             │
│  │   - Description  │  │                  │             │
│  │   - CTA Button   │  │                  │             │
│  │                  │  │                  │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│                    Footer                                 │
└─────────────────────────────────────────────────────────┘
```

### Code Example

```jsx
import Navbar from '@/components/Navigation/Navbar';
import Footer from '@/components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Full Width */}
      <section className="w-full bg-gradient-to-r from-gulf-stream to-river-bed text-white py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6">
            Future Generation Academy
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Empowering young athletes through excellence in sports training
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gulf-stream px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-fast">
              View Programs
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gulf-stream transition-colors duration-fast">
              Upcoming Events
            </button>
          </div>
        </div>
      </section>

      {/* Section 1 - Text Left, Image Right */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Left Side */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-river-bed mb-4">
              Excellence in Football Training
            </h2>
            <p className="text-lg text-oslo-gray mb-6">
              At Future Generation Academy, we're dedicated to developing young football talent through professional coaching, structured training programs, and competitive opportunities.
            </p>
            <p className="text-base text-oslo-gray mb-8">
              Our programs are designed for athletes at all levels, from beginners learning the fundamentals to advanced players preparing for competitive play. With experienced coaches and state-of-the-art facilities, we provide the foundation for athletic success.
            </p>
            <button className="bg-gulf-stream text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-fast">
              Learn More About Our Programs
            </button>
          </div>

          {/* Image - Right Side */}
          <div className="order-first lg:order-last">
            <div className="rounded-lg shadow-lg overflow-hidden">
              <img 
                src="/images/fga-training.jpg" 
                alt="FGA Football Training Session"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
```

### Key Features
- **Hero Section**: Full-width with gradient background, centered content
- **Section 1**: Two-column layout with text on left, image on right
  - **Text Side**: Heading, description paragraphs, and CTA button
  - **Image Side**: High-quality photo showcasing FGA training
  - **Responsive**: Stacks vertically on mobile (image first, then text)
- **Layout**: Uses `grid grid-cols-1 lg:grid-cols-2` for responsive two-column layout
- **Spacing**: Uses design system spacing tokens (`py-16 lg:py-24`, `gap-8 lg:gap-12`)
- **Image Styling**: Rounded corners with `shadow-lg` for elevation
- **Order Control**: `order-first lg:order-last` ensures image appears first on mobile, last on desktop

---

## Two-column Sidebar Layout

### Description
A fixed or collapsible sidebar on the left with main content area on the right. Perfect for admin panels, dashboards, and settings pages where navigation and content need to coexist.

### When to Use
- **FGA Admin Dashboard**: Overview of registrations, events, payments
- **Event Management**: Create, edit, and manage tournaments and events
- **Registration Management**: View and manage program/tournament registrations
- **Membership Management**: Manage member accounts and subscriptions
- **Payment Records**: View Stripe payment history and receipts
- **Content Management**: Update website content, manage pages

### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│          │          Main Content Area                    │
│ Sidebar  │                                               │
│          │          ┌─────────────────┐                 │
│  ┌─────┐ │          │                 │                 │
│  │ Nav │ │          │   Content       │                 │
│  │ Item│ │          │   Section       │                 │
│  └─────┘ │          │                 │                 │
│          │          └─────────────────┘                 │
│  ┌─────┐ │                                               │
│  │ Nav │ │          ┌─────────────────┐                 │
│  │ Item│ │          │                 │                 │
│  └─────┘ │          │   Content       │                 │
│          │          │   Section       │                 │
│  ┌─────┐ │          │                 │                 │
│  │ Nav │ │          └─────────────────┘                 │
│  │ Item│ │                                               │
│  └─────┘ │                                               │
│          │                                               │
└──────────┴──────────────────────────────────────────────┘
```

### Code Example

```jsx
import { useState } from 'react';
import Navbar from '@/components/Navigation/Navbar';
import Sidebar from '@/components/Navigation/Sidebar';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`bg-river-bed text-white transition-all duration-base ${
            sidebarOpen ? 'w-64' : 'w-20'
          } min-h-screen fixed left-0 top-16`}
        >
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-6 p-2 hover:bg-opacity-20 rounded-lg"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
            
            <nav className="space-y-2">
              <a 
                href="/admin/dashboard" 
                className="block px-4 py-3 rounded-lg hover:bg-gulf-stream transition-colors duration-fast"
              >
                {sidebarOpen && 'Dashboard'}
              </a>
              <a 
                href="/admin/events" 
                className="block px-4 py-3 rounded-lg hover:bg-gulf-stream transition-colors duration-fast"
              >
                {sidebarOpen && 'Events & Tournaments'}
              </a>
              <a 
                href="/admin/registrations" 
                className="block px-4 py-3 rounded-lg hover:bg-gulf-stream transition-colors duration-fast"
              >
                {sidebarOpen && 'Registrations'}
              </a>
              <a 
                href="/admin/memberships" 
                className="block px-4 py-3 rounded-lg hover:bg-gulf-stream transition-colors duration-fast"
              >
                {sidebarOpen && 'Memberships'}
              </a>
              <a 
                href="/admin/payments" 
                className="block px-4 py-3 rounded-lg hover:bg-gulf-stream transition-colors duration-fast"
              >
                {sidebarOpen && 'Payments'}
              </a>
              <a 
                href="/admin/content" 
                className="block px-4 py-3 rounded-lg hover:bg-gulf-stream transition-colors duration-fast"
              >
                {sidebarOpen && 'Content Management'}
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-base ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}>
          <div className="p-6 lg:p-8">
            <h1 className="text-3xl font-heading font-bold text-river-bed mb-6">
              Dashboard
            </h1>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-base p-6">
                <h3 className="text-sm text-oslo-gray mb-2">Total Members</h3>
                <p className="text-3xl font-bold text-river-bed">1,234</p>
                <p className="text-xs text-oslo-gray mt-1">+12 this month</p>
              </div>
              <div className="bg-white rounded-lg shadow-base p-6">
                <h3 className="text-sm text-oslo-gray mb-2">Active Programs</h3>
                <p className="text-3xl font-bold text-river-bed">3</p>
                <p className="text-xs text-oslo-gray mt-1">Football programs</p>
              </div>
              <div className="bg-white rounded-lg shadow-base p-6">
                <h3 className="text-sm text-oslo-gray mb-2">Upcoming Events</h3>
                <p className="text-3xl font-bold text-river-bed">8</p>
                <p className="text-xs text-oslo-gray mt-1">Next: Summer Championship</p>
              </div>
              <div className="bg-white rounded-lg shadow-base p-6">
                <h3 className="text-sm text-oslo-gray mb-2">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-river-bed">$45K</p>
                <p className="text-xs text-oslo-gray mt-1">From subscriptions</p>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-lg shadow-base p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-semibold text-river-bed">
                  Recent Registrations
                </h2>
                <a href="/admin/registrations" className="text-gulf-stream hover:underline text-sm">
                  View All →
                </a>
              </div>
              {/* Registration list content */}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-semibold text-river-bed">
                  Upcoming Events
                </h2>
                <a href="/admin/events" className="text-gulf-stream hover:underline text-sm">
                  Manage Events →
                </a>
              </div>
              {/* Events list content */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
```

### Key Features
- **Fixed Sidebar**: Stays visible on scroll, can be collapsed
- **Responsive**: Sidebar collapses on mobile, becomes a drawer
- **Main Content**: Adjusts margin based on sidebar state
- **Navigation**: Sidebar uses River Bed background with Gulf Stream hover

---

## Centered Card Layout

### Description
A centered card layout perfect for focused interactions like login, signup, or single-purpose forms. The content is centered both horizontally and vertically.

### When to Use
- **Login/Signup Pages**: Member authentication for parents and athletes
- **Password Reset**: Account recovery forms
- **Program Registration**: Multi-step registration forms for programs/tournaments
- **Contact Forms**: Parent inquiries, sponsorship requests
- **Single-purpose Focused Interactions**: Any form that requires user attention

### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│                                                           │
│                    ┌──────────────┐                      │
│                    │              │                      │
│                    │              │                      │
│                    │    Card      │                      │
│                    │   Content    │                      │
│                    │              │                      │
│                    │              │                      │
│                    └──────────────┘                      │
│                                                           │
│                                                           │
│                    Footer                                 │
└─────────────────────────────────────────────────────────┘
```

### Code Example

```jsx
import Navbar from '@/components/Navigation/Navbar';
import Footer from '@/components/Footer';
import { Input, Button } from '@/components';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 lg:p-10">
            <div className="text-center mb-8">
              <div className="mb-4">
                <img src="/FGA-Logo.png" alt="FGA Logo" className="h-12 mx-auto" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-river-bed mb-2">
                Welcome Back
              </h1>
              <p className="text-oslo-gray">
                Sign in to access your account, view registrations, and manage subscriptions
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-river-bed mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-river-bed mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-oslo-gray">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm text-gulf-stream hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleLogin}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-oslo-gray">
                Don't have an account?{' '}
                <a href="/signup" className="text-gulf-stream hover:underline font-medium">
                  Create Account
                </a>
              </p>
              <p className="text-sm text-oslo-gray mt-2">
                <a href="/forgot-password" className="text-gulf-stream hover:underline">
                  Forgot your password?
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
```

### Key Features
- **Centered Vertically**: Uses flexbox `items-center` to center content
- **Max Width**: Card constrained to `max-w-md` (448px) for readability
- **Card Styling**: White background, `shadow-lg`, rounded corners
- **Responsive Padding**: Adjusts padding on mobile vs desktop

---

## Table Layout

### Description
A layout optimized for displaying tabular data with filters, search, and pagination. Ideal for admin lists, data tables, and management interfaces.

### When to Use
- **Events & Tournaments List**: Calendar view, filters by sport/date
- **Registration Management**: View all program/tournament registrations
- **Membership Management**: List of members, subscription status
- **Payment Records**: Stripe payment history, receipts
- **Program Management**: List of programs with schedules
- Any admin page requiring sortable, filterable data tables

### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│                    Navigation Bar                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Page Title                                    [Action]  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [Search...]              [Filter ▼] [Sort ▼]  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Header │ Header │ Header │ Header │ Actions    │    │
│  ├────────┼────────┼────────┼────────┼────────────┤    │
│  │ Data   │ Data   │ Data   │ Data   │ [Edit] [×] │    │
│  ├────────┼────────┼────────┼────────┼────────────┤    │
│  │ Data   │ Data   │ Data   │ Data   │ [Edit] [×] │    │
│  ├────────┼────────┼────────┼────────┼────────────┤    │
│  │ Data   │ Data   │ Data   │ Data   │ [Edit] [×] │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Showing 1-10 of 50          [<] 1 2 3 4 5 [>]           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Code Example

```jsx
import { useState } from 'react';
import Navbar from '@/components/Navigation/Navbar';
import { Table, Pagination, Button } from '@/components';

function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
    // ... more users
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-river-bed">
              Event Registrations
            </h1>
            <p className="text-oslo-gray mt-1">
              Manage registrations for programs and tournaments
            </p>
          </div>
          <Button variant="primary">
            Export Data
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-base p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by athlete name, parent email, or program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-geyser rounded-lg focus:outline-none focus:ring-2 focus:ring-gulf-stream"
              />
            </div>
            <select className="px-4 py-2 border border-geyser rounded-lg focus:outline-none focus:ring-2 focus:ring-gulf-stream">
              <option>All Programs</option>
              <option>Beginner Football</option>
              <option>Intermediate Football</option>
              <option>Advanced Football</option>
            </select>
            <select className="px-4 py-2 border border-geyser rounded-lg focus:outline-none focus:ring-2 focus:ring-gulf-stream">
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <select className="px-4 py-2 border border-geyser rounded-lg focus:outline-none focus:ring-2 focus:ring-gulf-stream">
              <option>Sort by Date</option>
              <option>Sort by Name</option>
              <option>Sort by Program</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-river-bed text-white">
                  <th className="px-6 py-4 text-left font-semibold">Athlete Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Parent Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Program/Event</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Registered</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr 
                    key={registration.id}
                    className="border-b border-geyser hover:bg-[#f0f5f5] transition-colors duration-fast"
                  >
                    <td className="px-6 py-4 text-river-bed font-medium">{registration.athleteName}</td>
                    <td className="px-6 py-4 text-oslo-gray">{registration.parentEmail}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gulf-stream text-white rounded text-sm">
                        {registration.program}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        registration.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : registration.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-oslo-gray">Jan 15, 2024</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-gulf-stream hover:text-river-bed transition-colors duration-fast text-sm">
                          View
                        </button>
                        <button className="text-gulf-stream hover:text-river-bed transition-colors duration-fast text-sm">
                          Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-oslo-gray">
            Showing 1-10 of 50 registrations
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
```

### Key Features
- **Header Section**: Page title with action button
- **Filter Bar**: Search, filters, and sorting controls
- **Responsive Table**: Horizontal scroll on mobile
- **Striped Rows**: Alternating backgrounds for readability
- **Pagination**: Bottom pagination controls
- **Action Buttons**: Edit/Delete actions per row

---

## Layout Selection Guide

### Decision Tree

```
Is this a marketing/landing page?
├─ Yes → Use Full-width Hero + Content Grid
└─ No → Continue

Is this an admin/dashboard page?
├─ Yes → Does it need navigation sidebar?
│   ├─ Yes → Use Two-column Sidebar Layout
│   └─ No → Use Table Layout (if data-heavy) or Centered Card (if focused)
└─ No → Continue

Is this a focused interaction (login, form)?
├─ Yes → Use Centered Card Layout
└─ No → Use Full-width Hero + Content Grid
```

### Quick Reference

| Page Type | Layout | Key Classes | FGA Example |
|-----------|--------|-------------|-------------|
| Homepage | Full-width Hero + Grid | `w-full`, `grid grid-cols-1 md:grid-cols-3`, `gap-6` | Homepage with featured tournaments and programs |
| Programs Page | Full-width Hero + Grid | `w-full`, `grid grid-cols-1 md:grid-cols-3`, `gap-6` | Football programs listing (Beginner, Intermediate, Advanced) |
| About Page | Full-width Hero + Grid | `w-full`, `grid grid-cols-1 md:grid-cols-2`, `gap-6` | About page with history and coaching staff |
| Admin Dashboard | Two-column Sidebar | `flex`, `w-64` (sidebar), `flex-1` (content) | FGA Admin Dashboard with stats and recent activity |
| Event Management | Two-column Sidebar | `flex`, `w-64` (sidebar), `flex-1` (content) | Create/edit tournaments and events |
| Login/Signup | Centered Card | `flex items-center justify-center`, `max-w-md` | Member login/signup pages |
| Program Registration | Centered Card | `flex items-center justify-center`, `max-w-md` | Multi-step registration form |
| Events List | Table Layout | `overflow-x-auto`, `min-w-full`, `border-b` | Events & Tournaments listing with calendar |
| Registrations List | Table Layout | `overflow-x-auto`, `min-w-full`, `border-b` | Registration management table |
| Payment Records | Table Layout | `overflow-x-auto`, `min-w-full`, `border-b` | Stripe payment history table |

---

## Best Practices

### Spacing
- Use design system spacing tokens (`p-6`, `gap-6`, `mb-8`)
- Maintain consistent padding across layout sections
- Use `max-w-6xl` or `max-w-7xl` for content containers

### Responsive Design
- Always test layouts on mobile, tablet, and desktop
- Use Tailwind's responsive prefixes (`md:`, `lg:`)
- Sidebars should collapse to drawers on mobile
- Tables should scroll horizontally on small screens

### Accessibility
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Use semantic HTML (`<nav>`, `<main>`, `<aside>`)
- Maintain keyboard navigation for all interactive elements
- Provide ARIA labels for icon-only buttons

### Performance
- Lazy load images in hero sections
- Virtualize long tables for better performance
- Use CSS transitions for smooth layout changes
- Minimize layout shifts during page load

