# Design Implementation Checklist
_Quick reference for implementing Bayer 04-inspired design_

---

## Color Palette

- [ ] Define FGA primary color (equivalent to Bayer's red #E20613)
- [ ] Define secondary colors
- [ ] Set up TailwindCSS custom color configuration
- [ ] Create color variables in CSS/Tailwind config
- [ ] Ensure WCAG AA accessibility contrast ratios

```javascript
// tailwind.config.js example
colors: {
  primary: {
    50: '#...',
    100: '#...',
    // ... define full scale
    900: '#...',
  },
  dark: {
    DEFAULT: '#000000',
    800: '#1a1a1a',
    900: '#0a0a0a',
  }
}
```

---

## Typography

- [ ] Install chosen font families (Inter, Poppins, or Montserrat recommended)
- [ ] Configure font weights (400, 600, 700, 900)
- [ ] Set up typography scale in Tailwind
- [ ] Create heading component styles
- [ ] Create body text styles
- [ ] Implement uppercase section headers

**Example Classes:**
```css
.hero-title: text-6xl font-black uppercase
.section-title: text-4xl font-bold uppercase
.card-title: text-xl font-bold
.body-text: text-base font-normal
```

---

## Layout Components

### Header/Navigation
- [ ] Dark background (#000000 or similar)
- [ ] Logo + brand name on left
- [ ] Horizontal navigation menu (desktop)
- [ ] Hamburger menu (mobile)
- [ ] Right-side utilities (search, login, language)
- [ ] Prominent CTA buttons (Register, Login)
- [ ] Sticky/fixed on scroll
- [ ] Mobile responsive toggle

### Hero Section
- [ ] Full-width image carousel/slider
- [ ] Multiple slides (3-5 slides)
- [ ] Text overlay with gradient
- [ ] Category tag + headline + description
- [ ] CTA button(s)
- [ ] Navigation dots
- [ ] Auto-play with pause on hover
- [ ] Mobile responsive (stack text, smaller images)

### News/Content Grid
- [ ] 4-column grid (desktop)
- [ ] 2-column (tablet)
- [ ] 1-column (mobile)
- [ ] Dark card backgrounds
- [ ] Image thumbnail
- [ ] Category tag (colored)
- [ ] Date stamp
- [ ] Headline and excerpt
- [ ] "Read more" link
- [ ] Hover effects (scale, brightness)

### Video Section
- [ ] Section title with accent symbol
- [ ] Video grid (4 columns → 2 → 1)
- [ ] Thumbnail + play overlay
- [ ] Duration badge
- [ ] Video title and date
- [ ] Modal video player or embed
- [ ] "Load more" button

### Feature Section
- [ ] Full-width layout
- [ ] Text + image split (50/50)
- [ ] Large heading with accent
- [ ] Descriptive paragraph
- [ ] CTA button
- [ ] Decorative accent shapes (optional)
- [ ] High contrast design

### Footer
- [ ] Dark background
- [ ] Multi-column layout (4-5 columns)
- [ ] Logo and brief info
- [ ] Navigation links
- [ ] Contact information
- [ ] Social media icons
- [ ] Sponsor logos (if applicable)
- [ ] Legal links (Privacy, Terms)
- [ ] Copyright notice
- [ ] Mobile: stack columns vertically

---

## UI Components

### Buttons

**Primary Button:**
- [ ] Accent color background (e.g., red)
- [ ] White text
- [ ] Bold/medium weight
- [ ] Rounded corners (sm)
- [ ] Padding: px-6 py-3
- [ ] Hover: darker shade + slight scale
- [ ] Active state
- [ ] Disabled state (gray, not clickable)

```jsx
<button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded transition hover:scale-105">
  Register Now
</button>
```

**Secondary Button:**
- [ ] Transparent background
- [ ] Accent color border
- [ ] Accent color text
- [ ] Hover: filled background
- [ ] Same sizing as primary

**Text Link:**
- [ ] Accent color
- [ ] Underline on hover
- [ ] Arrow icon (optional)
- [ ] "Show more" style

### Cards

**Content Card:**
- [ ] Dark background (bg-gray-900)
- [ ] No border or subtle border
- [ ] Rounded corners
- [ ] Image at top (full width)
- [ ] Padding for content (p-4)
- [ ] Category tag (small, colored)
- [ ] Title (bold, white)
- [ ] Date/metadata (small, gray)
- [ ] Description text (gray)
- [ ] CTA link
- [ ] Hover: scale-105 + brightness

```jsx
<div className="bg-gray-900 rounded-lg overflow-hidden transition hover:scale-105">
  <img src="..." alt="..." className="w-full h-48 object-cover" />
  <div className="p-4">
    <span className="text-xs text-primary-500 uppercase">Category</span>
    <h3 className="text-xl font-bold text-white mt-2">Card Title</h3>
    <p className="text-gray-400 mt-2">Description...</p>
    <a href="#" className="text-primary-500 mt-4 inline-block">Read more →</a>
  </div>
</div>
```

### Forms

**Input Fields:**
- [ ] Dark background (bg-gray-800)
- [ ] Light text (text-white)
- [ ] Border (subtle gray or none)
- [ ] Focus: accent color border
- [ ] Padding: px-4 py-3
- [ ] Rounded corners
- [ ] Placeholder text (gray)
- [ ] Error state (red border)
- [ ] Label above field

```jsx
<div className="mb-4">
  <label className="block text-white mb-2">Email</label>
  <input 
    type="email" 
    className="w-full bg-gray-800 text-white border border-gray-700 focus:border-primary-500 px-4 py-3 rounded"
    placeholder="your@email.com"
  />
</div>
```

### Icons

- [ ] Choose icon library (React Icons recommended)
- [ ] Consistent size (1.5rem default)
- [ ] Accent color for important icons
- [ ] Social media icons in footer
- [ ] Navigation icons (menu, search, user)
- [ ] Decorative accent symbols (+ icon)

---

## Animations & Interactions

### Scroll Animations
- [ ] Fade-in on scroll (AOS library)
- [ ] Stagger animations for grids
- [ ] Parallax for hero background (optional)

### Hover Effects
- [ ] Cards: scale-105 + brightness-110
- [ ] Buttons: scale-105 + darker background
- [ ] Links: color change + underline
- [ ] Images: zoom or overlay

### Transitions
- [ ] All transitions: 200-300ms
- [ ] Ease-in-out timing function
- [ ] Carousel: smooth slide or fade
- [ ] Modal: fade + scale

```jsx
// TailwindCSS classes
className="transition duration-300 ease-in-out hover:scale-105"
```

### Loading States
- [ ] Skeleton screens for content loading
- [ ] Spinner for button loading
- [ ] Progress bar for uploads
- [ ] Smooth content reveal

---

## Responsive Breakpoints

**TailwindCSS Default:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Implementation:**
```jsx
// 4 columns → 2 → 1
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

**Checklist:**
- [ ] Mobile-first approach
- [ ] Test all breakpoints
- [ ] Hamburger menu < 1024px
- [ ] Stack layouts on mobile
- [ ] Readable text sizes on all devices
- [ ] Touch-friendly buttons (min 44x44px)
- [ ] Proper image scaling

---

## Performance Optimization

- [ ] Lazy load images (below fold)
- [ ] Optimize images (WebP format, compressed)
- [ ] Code splitting (React.lazy)
- [ ] Minimize bundle size
- [ ] Use CDN for static assets
- [ ] Enable GZIP compression
- [ ] Defer non-critical JavaScript
- [ ] Preload critical fonts

```jsx
// Lazy load images
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src="image.jpg"
  alt="..."
  effect="blur"
/>
```

---

## Accessibility

- [ ] Semantic HTML (header, nav, main, footer, section)
- [ ] Alt text for all images
- [ ] ARIA labels for icons and buttons
- [ ] Keyboard navigation (focus states)
- [ ] Color contrast ratios (WCAG AA)
- [ ] Skip to main content link
- [ ] Form field labels
- [ ] Error messages for screen readers

```jsx
// Example accessible button
<button aria-label="Close menu" className="...">
  <CloseIcon />
</button>
```

---

## Testing Checklist

### Visual Testing
- [ ] Compare with Bayer 04 reference
- [ ] Check on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Dark mode consistency
- [ ] Image quality and loading

### Functional Testing
- [ ] Navigation works on all devices
- [ ] Carousel auto-plays and navigates manually
- [ ] Forms validate correctly
- [ ] Buttons have proper states (hover, active, disabled)
- [ ] Links go to correct destinations
- [ ] Modals open and close properly
- [ ] Responsive menu toggles correctly

### Performance Testing
- [ ] Page load time < 2 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Smooth scrolling and animations
- [ ] Fast API response times

---

## Implementation Order

1. **Setup** (Week 1)
   - [ ] Install dependencies
   - [ ] Configure Tailwind with custom colors
   - [ ] Set up fonts
   - [ ] Create base layout structure

2. **Components** (Week 2-3)
   - [ ] Header/Navigation
   - [ ] Hero carousel
   - [ ] Card components
   - [ ] Button components
   - [ ] Form components
   - [ ] Footer

3. **Pages** (Week 3-5)
   - [ ] Home page
   - [ ] About page
   - [ ] Programs page
   - [ ] Events page
   - [ ] News page
   - [ ] Contact page

4. **Features** (Week 5-7)
   - [ ] User authentication
   - [ ] Registration system
   - [ ] Admin panel
   - [ ] Payment integration

5. **Polish** (Week 7-8)
   - [ ] Animations and transitions
   - [ ] Loading states
   - [ ] Error handling
   - [ ] Responsive refinement
   - [ ] Performance optimization

6. **QA** (Week 8-9)
   - [ ] Cross-browser testing
   - [ ] Device testing
   - [ ] Accessibility audit
   - [ ] Performance audit
   - [ ] Client feedback and revisions

---

## Quick Tips

1. **Use Tailwind's @apply for repeated patterns:**
```css
.card-base {
  @apply bg-gray-900 rounded-lg overflow-hidden transition hover:scale-105;
}
```

2. **Create reusable components:**
```jsx
// components/SectionTitle.jsx
export const SectionTitle = ({ children }) => (
  <h2 className="text-4xl font-bold uppercase text-white mb-8 flex items-center gap-4">
    <span className="text-primary-600 text-5xl">+</span>
    {children}
  </h2>
);
```

3. **Consistent spacing:**
Use Tailwind's spacing scale: 4, 6, 8, 12, 16, 20, 24

4. **Mobile debugging:**
Use Chrome DevTools device emulation during development

5. **Component library:**
Consider Headless UI or Radix UI for accessible base components

---

**Remember:** Adapt, don't copy. Use Bayer 04 as inspiration while making it unique for FGA!

---

**Last Updated:** November 22, 2025

