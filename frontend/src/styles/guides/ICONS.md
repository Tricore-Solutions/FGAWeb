# Icon Usage Guide

This guide documents which icons to use for common actions and UI elements throughout the Future Generation Academy website. Icons provide visual cues that enhance usability and help users quickly understand interface elements.

## Icon Library

**Recommended Library**: `lucide-react`

Lucide React provides a comprehensive set of simple, flat icons that align with the design system's clean, modern aesthetic. The icons are consistent in style and optimized for React.

### Installation

```bash
npm install lucide-react
```

### Alternative

If you prefer more icon variety, you can use `react-icons` which includes multiple icon sets (Font Awesome, Material Design, etc.):

```bash
npm install react-icons
```

---

## Icon Categories

### Navigation Icons

Navigation icons are used in menus, sidebars, and navigation bars to help users understand where they are and where they can go.

| Icon | Name | Usage | Code Example |
|------|------|-------|--------------|
| 🏠 | **Home** | Homepage, main page | `import { House } from 'lucide-react';` |
| ℹ️ | **Info** | About page, information | `import { Info } from 'lucide-react';` |
| 🎓 | **Programs** | Programs page, training programs | `import { Dumbbell } from 'lucide-react';` |
| 📅 | **Calendar** | Events, tournaments, schedules | `import { Calendar1 } from 'lucide-react';` |
| 👤 | **User** | User profile, account, member area | `import { UserRound } from 'lucide-react';` |
| 📊 | **LayoutDashboard** | Admin dashboard, analytics | `import { ChartNoAxesCombined } from 'lucide-react';` |
| 👥 | **Users** | Registration management, multiple users | `import { UsersRound } from 'lucide-react';` |
| ✅ | **UserCheck** | Membership management, verified users | `import { BadgeCheck } from 'lucide-react';` |
| 💳 | **CreditCard** | Subscription payments, payment records | `import { CreditCard } from 'lucide-react';` |
| 📄 | **FileText** | Content management, CMS | `import { Files } from 'lucide-react';` |
| ⚙️ | **Settings** | Settings page, configuration | `import { Settings } from 'lucide-react';` |
| 🚪 | **Logout** | Sign out, exit account | `import { LogOut } from 'lucide-react';` |

#### Code Examples

```jsx
import { House, Info, Dumbbell, Calendar1, UserRound } from 'lucide-react';

// Public navigation menu (FGA website)
<nav className="flex items-center gap-6">
  <a href="/" className="flex items-center gap-2">
    <House size={20} style={{ color: colors['river-bed'] }} />
    <span>Home</span>
  </a>
  <a href="/about" className="flex items-center gap-2">
    <Info size={20} style={{ color: colors['river-bed'] }} />
    <span>About</span>
  </a>
  <a href="/programs" className="flex items-center gap-2">
    <Dumbbell size={20} style={{ color: colors['river-bed'] }} />
    <span>Programs</span>
  </a>
  <a href="/events" className="flex items-center gap-2">
    <Calendar1 size={20} style={{ color: colors['river-bed'] }} />
    <span>Events & Tournaments</span>
  </a>
  <a href="/dashboard" className="flex items-center gap-2">
    <UserRound size={20} style={{ color: colors['river-bed'] }} />
    <span>Membership</span>
  </a>
</nav>

// Membership dashboard navigation
import { UserRound, CreditCard, Settings, LogOut } from 'lucide-react';

<nav className="space-y-2">
  <a href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-geyser rounded-lg">
    <UserRound size={20} style={{ color: colors['river-bed'] }} />
    <span>Profile</span>
  </a>
  <a href="/dashboard/subscription" className="flex items-center gap-2 px-4 py-2 hover:bg-geyser rounded-lg">
    <CreditCard size={20} style={{ color: colors['river-bed'] }} />
    <span>Subscription</span>
  </a>
  <a href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-geyser rounded-lg">
    <Settings size={20} style={{ color: colors['river-bed'] }} />
    <span>Settings</span>
  </a>
  <button className="flex items-center gap-2 px-4 py-2 hover:bg-geyser rounded-lg w-full text-left">
    <LogOut size={20} style={{ color: colors['river-bed'] }} />
    <span>Logout</span>
  </button>
</nav>

// Admin panel sidebar (FGA Admin)
import { ChartNoAxesCombined, Calendar1, UsersRound, BadgeCheck, CreditCard, Files } from 'lucide-react';

<aside className="bg-river-bed text-white">
  <nav className="p-4 space-y-2">
    <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <ChartNoAxesCombined size={20} />
      <span>Dashboard</span>
    </a>
    <a href="/admin/events" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <Calendar1 size={20} />
      <span>Events & Tournaments</span>
    </a>
    <a href="/admin/registrations" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <UsersRound size={20} />
      <span>Registrations</span>
    </a>
    <a href="/admin/memberships" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <BadgeCheck size={20} />
      <span>Memberships</span>
    </a>
    <a href="/admin/payments" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <CreditCard size={20} />
      <span>Payments</span>
    </a>
    <a href="/admin/content" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <Files size={20} />
      <span>Content Management</span>
    </a>
  </nav>
</aside>
```

---

### Action Icons

Action icons represent user actions like creating, editing, deleting, saving, or canceling operations.

| Icon | Name | Usage | Code Example |
|------|------|-------|--------------|
| ➕ | **Plus** | Add new, create, register | `import { Plus } from 'lucide-react';` |
| ✏️ | **Edit** | Edit, modify, update | `import { SquarePen } from 'lucide-react';` |
| 🗑️ | **Delete** | Remove, delete, trash | `import { Trash } from 'lucide-react';` |
| 💾 | **Save** | Save changes, submit | `import { Save } from 'lucide-react';` |
| ❌ | **Cancel** | Cancel, close, dismiss | `import { X } from 'lucide-react';` |

#### Code Examples

```jsx
import { Plus, SquarePen, Trash, Save, X } from 'lucide-react';

// Add button with icon
<button className="flex items-center gap-2 bg-gulf-stream text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
  <Plus size={18} />
  <span>Add New Event</span>
</button>

// Edit button in table row
<button 
  className="flex items-center gap-1 text-gulf-stream hover:text-river-bed transition-colors"
  onClick={handleEdit}
>
  <SquarePen size={16} />
  <span className="text-sm">Edit</span>
</button>

// Delete button with confirmation
<button 
  className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
  onClick={handleDelete}
>
  <Trash size={16} />
  <span className="text-sm">Delete</span>
</button>

// Save button in form
<button className="flex items-center gap-2 bg-gulf-stream text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
  <Save size={18} />
  <span>Save Changes</span>
</button>

// Cancel button
<button className="flex items-center gap-2 border border-river-bed text-river-bed px-6 py-2 rounded-lg hover:bg-geyser">
  <X size={18} />
  <span>Cancel</span>
</button>

// Icon-only action buttons in table
<td className="px-6 py-4">
  <div className="flex gap-3">
    <button 
      className="p-1 hover:bg-geyser rounded transition-colors"
      onClick={handleEdit}
      aria-label="Edit registration"
    >
      <SquarePen size={18} style={{ color: colors['gulf-stream'] }} />
    </button>
    <button 
      className="p-1 hover:bg-geyser rounded transition-colors"
      onClick={handleDelete}
      aria-label="Delete registration"
    >
      <Trash size={18} style={{ color: '#ef4444' }} />
    </button>
  </div>
</td>
```

---

### Status Icons

Status icons communicate the state of operations, validation, or system messages. They use semantic colors to convey meaning.

| Icon | Name | Usage | Code Example |
|------|------|-------|--------------|
| ✅ | **CheckCircle** | Success, completed, valid | `import { CircleCheckBig } from 'lucide-react';` |
| ❌ | **XCircle** | Error, failed, invalid | `import { CircleX } from 'lucide-react';` |
| ⚠️ | **AlertTriangle** | Warning, caution, attention | `import { TriangleAlert } from 'lucide-react';` |
| ℹ️ | **Info** | Information, help, details | `import { Info } from 'lucide-react';` |

#### Code Examples

```jsx
import { CircleCheckBig, CircleX, TriangleAlert, Info } from 'lucide-react';

// Success status in form
<div className="flex items-center gap-2 text-green-600">
  <CircleCheckBig size={20} />
  <span className="text-sm">Registration successful!</span>
</div>

// Error status
<div className="flex items-center gap-2 text-red-600">
  <CircleX size={20} />
  <span className="text-sm">Please check your input</span>
</div>

// Warning alert
<div className="flex items-start gap-3 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
  <TriangleAlert size={20} style={{ color: '#d97706' }} className="mt-0.5" />
  <div>
    <h4 className="font-semibold text-yellow-800 mb-1">Warning</h4>
    <p className="text-yellow-700">Your session will expire in 5 minutes.</p>
  </div>
</div>

// Info alert
<div className="flex items-start gap-3 bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
  <Info size={20} style={{ color: '#2563eb' }} className="mt-0.5" />
  <div>
    <h4 className="font-semibold text-blue-800 mb-1">Info</h4>
    <p className="text-blue-700">New events are posted every Monday.</p>
  </div>
</div>

// Status indicators in table
<td className="px-6 py-4">
  <div className="flex items-center gap-2">
    <CircleCheckBig size={18} style={{ color: '#22c55e' }} />
    <span className="text-sm text-green-800">Confirmed</span>
  </div>
</td>

// Form validation icons
<div className="relative">
  <input 
    type="email" 
    className="w-full px-4 py-2 border-2 border-green-500 rounded-lg pr-10"
    placeholder="Enter email"
  />
  <CircleCheckBig 
    size={20} 
    style={{ color: '#22c55e' }} 
    className="absolute right-3 top-1/2 transform -translate-y-1/2"
  />
</div>
```

---

## Icon Sizing

Icons should follow the design system's size scale:

| Size Token | Pixels | Usage | Tailwind Class |
|------------|--------|-------|----------------|
| `xs` | 12px | Small labels, inline text | `w-3 h-3` |
| `sm` | 16px | Buttons, form inputs | `w-4 h-4` |
| `md` | 20px | Navigation, standard actions | `w-5 h-5` |
| `lg` | 24px | Section headers, prominent actions | `w-6 h-6` |
| `xl` | 32px | Hero sections, feature highlights | `w-8 h-8` |

### Usage with Lucide React

```jsx
import { House, UserRound, Calendar1 } from 'lucide-react';

// Using size prop (recommended)
<House size={20} />  // 20px
<House size={16} />  // 16px
<House size={24} />  // 24px

// Using className for sizing
<House className="w-5 h-5" />
<House className="w-6 h-6" />
```

---

## Icon Colors

Icons should use the design system color palette:

| Color | Hex Value | Usage | Example |
|-------|-----------|-------|---------|
| **Default** | `#454f59` (River Bed) | Standard icons, navigation | `<Home style={{ color: colors['river-bed'] }} />` |
| **Primary** | `#80b3b4` (Gulf Stream) | Active states, primary actions | `<Calendar style={{ color: colors['gulf-stream'] }} />` |
| **Secondary** | `#7f858c` (Oslo Gray) | Secondary text, labels | `<User style={{ color: colors['oslo-gray'] }} />` |
| **Success** | `#22c55e` (Green) | Success states, confirmations | `<CheckCircle2 style={{ color: '#22c55e' }} />` |
| **Error** | `#ef4444` (Red) | Errors, delete actions | `<XCircle style={{ color: '#ef4444' }} />` |
| **Warning** | `#d97706` (Amber) | Warnings, cautions | `<AlertTriangle style={{ color: '#d97706' }} />` |
| **Info** | `#2563eb` (Blue) | Information, help | `<Info style={{ color: '#2563eb' }} />` |

### Code Example with Colors

```jsx
import colors from '@/styles/design-tokens/colors';
import { House, CircleCheckBig, CircleX } from 'lucide-react';

// Default color
<House size={20} style={{ color: colors['river-bed'] }} />

// Primary color
<House size={20} style={{ color: colors['gulf-stream'] }} />

// Success color
<CircleCheckBig size={20} style={{ color: '#22c55e' }} />

// Error color
<CircleX size={20} style={{ color: '#ef4444' }} />
```

---

## Common Patterns

### Icon with Text Label

```jsx
import { UserRound } from 'lucide-react';

<div className="flex items-center gap-2">
  <UserRound size={20} style={{ color: colors['gulf-stream'] }} />
  <span className="text-river-bed">Profile</span>
</div>
```

### Icon Button

```jsx
import { Plus } from 'lucide-react';

<button 
  className="p-2 rounded-lg hover:bg-geyser transition-colors"
  onClick={handleAdd}
  aria-label="Add new item"
>
  <Plus size={20} style={{ color: colors['gulf-stream'] }} />
</button>
```

### Icon in Alert

```jsx
import { TriangleAlert } from 'lucide-react';

<div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded flex items-start gap-3">
  <TriangleAlert size={20} style={{ color: '#d97706' }} className="mt-0.5 flex-shrink-0" />
  <div>
    <h4 className="font-semibold text-yellow-800">Warning</h4>
    <p className="text-yellow-700">Please review your registration details.</p>
  </div>
</div>
```

### Icon in Status Badge

```jsx
import { CircleCheckBig } from 'lucide-react';

<span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
  <CircleCheckBig size={14} />
  Active
</span>
```

---

## FGA-Specific Icon Usage

Based on the pages defined in the PRD and DRD, here's how icons should be used across the FGA website:

### Public Pages Navigation

- **Home** (`House`): Home page - hero banner, featured tournaments, about overview
- **About** (`Info`): About page - history, vision/mission, coaching staff
- **Programs** (`Dumbbell`): Programs page - list of programs, schedules, registration CTA
- **Calendar** (`Calendar1`): Events & Tournaments page - calendar view, filters, event detail pages
- **User** (`UserRound`): Membership Dashboard - login, sign up, profile, subscription status

### Membership System Pages

- **User** (`UserRound`): Profile page - account management, profile updates
- **CreditCard** (`CreditCard`): Subscription payments - Stripe checkout, payment status
- **Settings** (`Settings`): User settings, preferences, password recovery
- **LogOut** (`LogOut`): Sign out of account

### Admin Panel Pages

- **LayoutDashboard** (`ChartNoAxesCombined`): Admin dashboard - overview, statistics
- **Calendar** (`Calendar1`): Event management - create, edit, delete events and tournaments
- **Users** (`UsersRound`): Registration management - view registrations, export data
- **UserCheck** (`BadgeCheck`): Membership management - view members, subscription status
- **CreditCard** (`CreditCard`): Payment records - view payment history, receipts
- **FileText** (`Files`): Content updates - CMS features, manage website content

### Action Icons for FGA

- **Plus** (`Plus`): 
  - Register for program/tournament (public)
  - Add new event (admin)
  - Create new registration (admin)
- **Edit** (`SquarePen`): 
  - Edit registration (members)
  - Modify event details (admin)
  - Update profile (members)
  - Edit content (admin CMS)
- **Delete** (`Trash`): 
  - Cancel registration (members)
  - Remove event (admin)
  - Delete registration (admin)
- **Save** (`Save`): 
  - Save registration form (public)
  - Update profile (members)
  - Save event changes (admin)
- **Cancel** (`X`): 
  - Cancel registration (members)
  - Close modal/dialog
  - Cancel form submission

### Status Icons for FGA

- **CircleCheckBig** (`CircleCheckBig`): 
  - Registration confirmed
  - Payment successful
  - Profile updated
  - Subscription active
- **CircleX** (`CircleX`): 
  - Registration failed
  - Payment error
  - Validation error
  - Subscription expired
- **TriangleAlert** (`TriangleAlert`): 
  - Registration pending
  - Payment warning
  - Session expiry
  - Subscription renewal reminder
- **Info** (`Info`): 
  - Event information
  - Program details
  - Help text
  - About page content

### Additional Icons for FGA Pages

- **Mail** (`Mail`): Email confirmation, receipts, notifications
- **Phone** (`Phone`): Contact information, WhatsApp integration
- **Search** (`Search`): Event search, program filters
- **Filter** (`Filter`): Event filters, registration filters (admin)
- **Download** (`Download`): Export registrations, download receipts
- **Upload** (`Upload`): Upload event images, upload content (admin)
- **Eye** (`Eye`): View registration details, preview content
- **Lock** (`Lock`): Password protection, secure payment
- **Unlock** (`Unlock`): Password reset, account access

---

## FGA Page-Specific Examples

### Public Navigation Bar

```jsx
import { House, Info, Dumbbell, Calendar1, UserRound } from 'lucide-react';

<nav className="flex items-center gap-6">
  <a href="/" className="flex items-center gap-2">
    <House size={20} style={{ color: colors['river-bed'] }} />
    <span>Home</span>
  </a>
  <a href="/about" className="flex items-center gap-2">
    <Info size={20} style={{ color: colors['river-bed'] }} />
    <span>About</span>
  </a>
  <a href="/programs" className="flex items-center gap-2">
    <Dumbbell size={20} style={{ color: colors['river-bed'] }} />
    <span>Programs</span>
  </a>
  <a href="/events" className="flex items-center gap-2">
    <Calendar1 size={20} style={{ color: colors['river-bed'] }} />
    <span>Events & Tournaments</span>
  </a>
  <a href="/dashboard" className="flex items-center gap-2">
    <UserRound size={20} style={{ color: colors['river-bed'] }} />
    <span>Membership</span>
  </a>
</nav>
```

### Membership Dashboard Navigation

```jsx
import { UserRound, CreditCard, Settings, LogOut } from 'lucide-react';

<nav className="space-y-2">
  <a href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-geyser rounded-lg">
    <UserRound size={20} style={{ color: colors['river-bed'] }} />
    <span>Profile</span>
  </a>
  <a href="/dashboard/subscription" className="flex items-center gap-3 px-4 py-3 hover:bg-geyser rounded-lg">
    <CreditCard size={20} style={{ color: colors['river-bed'] }} />
    <span>Subscription</span>
  </a>
  <a href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-geyser rounded-lg">
    <Settings size={20} style={{ color: colors['river-bed'] }} />
    <span>Settings</span>
  </a>
  <button className="flex items-center gap-3 px-4 py-3 hover:bg-geyser rounded-lg w-full text-left">
    <LogOut size={20} style={{ color: colors['river-bed'] }} />
    <span>Logout</span>
  </button>
</nav>
```

### Admin Panel Sidebar

```jsx
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck, 
  CreditCard, 
  FileText 
} from 'lucide-react';

<aside className="bg-river-bed text-white">
  <nav className="p-4 space-y-2">
    <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <LayoutDashboard size={20} />
      <span>Dashboard</span>
    </a>
    <a href="/admin/events" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <Calendar size={20} />
      <span>Events & Tournaments</span>
    </a>
    <a href="/admin/registrations" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <Users size={20} />
      <span>Registrations</span>
    </a>
    <a href="/admin/memberships" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <UserCheck size={20} />
      <span>Memberships</span>
    </a>
    <a href="/admin/payments" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <CreditCard size={20} />
      <span>Payments</span>
    </a>
    <a href="/admin/content" className="flex items-center gap-3 px-4 py-3 hover:bg-gulf-stream rounded-lg">
      <FileText size={20} />
      <span>Content Management</span>
    </a>
  </nav>
</aside>
```

### Programs Page Actions

```jsx
import { Plus, Calendar1, Info } from 'lucide-react';

// Program card with registration CTA
<div className="border border-geyser rounded-lg p-6">
  <h3 className="text-xl font-semibold mb-2">Beginner Football Program</h3>
  <div className="flex items-center gap-2 text-oslo-gray mb-4">
    <Calendar1 size={16} />
    <span className="text-sm">Mon, Wed, Fri - 4:00 PM</span>
  </div>
  <button className="flex items-center gap-2 bg-gulf-stream text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
    <Plus size={18} />
    <span>Register Now</span>
  </button>
</div>
```

### Events & Tournaments Page

```jsx
import { Calendar1, Search, Filter, Eye } from 'lucide-react';

// Event filters
<div className="flex items-center gap-4 mb-6">
  <div className="relative flex-1">
    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors['oslo-gray'] }} />
    <input 
      type="text" 
      placeholder="Search events..." 
      className="w-full pl-10 pr-4 py-2 border border-geyser rounded-lg"
    />
  </div>
  <button className="flex items-center gap-2 px-4 py-2 border border-geyser rounded-lg hover:bg-geyser">
    <Filter size={18} style={{ color: colors['river-bed'] }} />
    <span>Filters</span>
  </button>
</div>

// Event card
<div className="border border-geyser rounded-lg p-4">
  <div className="flex items-center gap-2 mb-2">
    <Calendar1 size={18} style={{ color: colors['gulf-stream'] }} />
    <span className="font-semibold">Summer Football Championship</span>
  </div>
  <p className="text-sm text-oslo-gray mb-4">June 15-20, 2024</p>
  <button className="flex items-center gap-2 text-gulf-stream hover:text-river-bed">
    <Eye size={16} />
    <span className="text-sm">View Details</span>
  </button>
</div>
```

### Registration Form Actions

```jsx
import { Save, X, Mail, CircleCheckBig } from 'lucide-react';

// Registration form buttons
<div className="flex gap-4 mt-6">
  <button className="flex items-center gap-2 bg-gulf-stream text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
    <Save size={18} />
    <span>Submit Registration</span>
  </button>
  <button className="flex items-center gap-2 border border-river-bed text-river-bed px-6 py-2 rounded-lg hover:bg-geyser">
    <X size={18} />
    <span>Cancel</span>
  </button>
</div>

// Registration confirmation
<div className="bg-green-100 border-l-4 border-green-500 p-4 rounded flex items-start gap-3">
  <CircleCheckBig size={20} style={{ color: '#22c55e' }} className="mt-0.5 flex-shrink-0" />
  <div>
    <h4 className="font-semibold text-green-800 mb-1">Registration Successful!</h4>
    <p className="text-green-700 mb-2">A confirmation email has been sent to your inbox.</p>
    <div className="flex items-center gap-2 text-green-800">
      <Mail size={16} />
      <span className="text-sm">Check your email for details</span>
    </div>
  </div>
</div>
```

### Admin Event Management

```jsx
import { Plus, SquarePen, Trash, Eye, Download } from 'lucide-react';

// Event management header
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-semibold">Events & Tournaments</h2>
  <button className="flex items-center gap-2 bg-gulf-stream text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
    <Plus size={18} />
    <span>Create New Event</span>
  </button>
</div>

// Event table actions
<td className="px-6 py-4">
  <div className="flex gap-3">
    <button 
      className="p-1 hover:bg-geyser rounded transition-colors"
      onClick={handleView}
      aria-label="View event"
    >
      <Eye size={18} style={{ color: colors['gulf-stream'] }} />
    </button>
    <button 
      className="p-1 hover:bg-geyser rounded transition-colors"
      onClick={handleEdit}
      aria-label="Edit event"
    >
      <SquarePen size={18} style={{ color: colors['gulf-stream'] }} />
    </button>
    <button 
      className="p-1 hover:bg-geyser rounded transition-colors"
      onClick={handleDelete}
      aria-label="Delete event"
    >
      <Trash size={18} style={{ color: '#ef4444' }} />
    </button>
  </div>
</td>

// Export registrations button
<button className="flex items-center gap-2 border border-river-bed text-river-bed px-4 py-2 rounded-lg hover:bg-geyser">
  <Download size={18} />
  <span>Export Registrations</span>
</button>
```

### Subscription Payment Page

```jsx
import { CreditCard, Lock, CircleCheckBig, CircleX } from 'lucide-react';

// Payment section
<div className="border border-geyser rounded-lg p-6">
  <div className="flex items-center gap-2 mb-4">
    <CreditCard size={20} style={{ color: colors['gulf-stream'] }} />
    <h3 className="text-lg font-semibold">Payment Information</h3>
  </div>
  <div className="flex items-center gap-2 text-sm text-oslo-gray mb-4">
    <Lock size={14} />
    <span>Your payment is secure and encrypted</span>
  </div>
  {/* Stripe payment form */}
</div>

// Payment status
<div className="flex items-center gap-2 text-green-600">
  <CircleCheckBig size={20} />
  <span>Payment successful! Receipt sent to your email.</span>
</div>
```

---

## Best Practices

1. **Consistency**: Use the same icon for the same action throughout the application
2. **Accessibility**: Always include `aria-label` for icon-only buttons
3. **Size**: Match icon size to text size (e.g., 20px icon with 16px text)
4. **Spacing**: Use `gap-2` (8px) between icon and text label
5. **Color**: Use semantic colors (success = green, error = red) for status icons
6. **Hover States**: Add hover effects to clickable icons (color change, background)
7. **Alignment**: Use `flex items-center` to vertically align icons with text

---

## Import Pattern

```jsx
// Import only what you need (tree-shaking friendly)
import { House, UserRound, Calendar1, Settings, LogOut } from 'lucide-react';
import { Plus, SquarePen, Trash, Save, X } from 'lucide-react';
import { CircleCheckBig, CircleX, TriangleAlert, Info } from 'lucide-react';

// Or import all at once
import * as Icons from 'lucide-react';
// Usage: <Icons.House size={20} />
```

---

## Alternative: Using react-icons

If you prefer `react-icons`, here are equivalent icons:

```jsx
import { FaHome, FaUser, FaCalendar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaInfoCircle 
} from 'react-icons/fa';

// Usage
<FaHome size={20} style={{ color: colors['river-bed'] }} />
<FiPlus size={18} style={{ color: colors['gulf-stream'] }} />
<FaCheckCircle size={20} style={{ color: '#22c55e' }} />
```

---

## Quick Reference

| Category | Icon Name | Import | Common Size | FGA Page Usage |
|----------|-----------|--------|-------------|----------------|
| Navigation | Home | `{ House }` | 20px | Home page |
| Navigation | Info | `{ Info }` | 20px | About page |
| Navigation | Programs | `{ Dumbbell }` | 20px | Programs page |
| Navigation | Calendar | `{ Calendar1 }` | 20px | Events & Tournaments |
| Navigation | User | `{ UserRound }` | 20px | Membership Dashboard, Profile |
| Navigation | LayoutDashboard | `{ ChartNoAxesCombined }` | 20px | Admin Dashboard |
| Navigation | Users | `{ UsersRound }` | 20px | Admin Registrations |
| Navigation | UserCheck | `{ BadgeCheck }` | 20px | Admin Memberships |
| Navigation | CreditCard | `{ CreditCard }` | 20px | Subscription, Admin Payments |
| Navigation | FileText | `{ Files }` | 20px | Admin Content Management |
| Navigation | Settings | `{ Settings }` | 20px | User Settings |
| Navigation | Logout | `{ LogOut }` | 20px | Sign out |
| Action | Plus | `{ Plus }` | 18px | Register, Create Event |
| Action | Edit | `{ SquarePen }` | 16-18px | Edit Registration, Event |
| Action | Delete | `{ Trash }` | 16-18px | Cancel Registration, Delete Event |
| Action | Save | `{ Save }` | 18px | Submit Form, Save Changes |
| Action | Cancel | `{ X }` | 18px | Cancel, Close Modal |
| Action | Search | `{ Search }` | 18px | Event Search |
| Action | Filter | `{ Filter }` | 18px | Event Filters |
| Action | Download | `{ Download }` | 18px | Export Registrations |
| Action | Eye | `{ Eye }` | 18px | View Details |
| Status | Success | `{ CircleCheckBig }` | 20px | Registration Confirmed, Payment Success |
| Status | Error | `{ CircleX }` | 20px | Registration Failed, Payment Error |
| Status | Warning | `{ TriangleAlert }` | 20px | Registration Pending, Payment Warning |
| Status | Info | `{ Info }` | 20px | Event Info, Program Details |

