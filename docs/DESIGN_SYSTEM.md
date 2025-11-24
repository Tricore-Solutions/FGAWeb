# Design System

## Brand Colors

### Color Palette

| Color Name | Hex Value | Swatch |
|------------|-----------|--------|
| Gulf Stream | `#80b3b4` | <span style="display: inline-block; width: 50px; height: 50px; background-color: #80b3b4; border: 1px solid #ccc; border-radius: 4px;"></span> |
| River Bed | `#454f59` | <span style="display: inline-block; width: 50px; height: 50px; background-color: #454f59; border: 1px solid #ccc; border-radius: 4px;"></span> |
| Oslo Gray | `#7f858c` | <span style="display: inline-block; width: 50px; height: 50px; background-color: #7f858c; border: 1px solid #ccc; border-radius: 4px;"></span> |
| Geyser | `#d5e0e1` | <span style="display: inline-block; width: 50px; height: 50px; background-color: #d5e0e1; border: 1px solid #ccc; border-radius: 4px;"></span> |

### Usage

Colors are exported from `frontend/src/styles/design-tokens/colors.js` and can be imported in components:

```javascript
import colors from '@/styles/design-tokens/colors';
// or
import { colors } from '@/styles/design-tokens/colors';
```

## Typography

### Font Families

- **Headings**: Poppins (weights: 400, 500, 600, 700)
- **Body**: Inter (weights: 400, 500, 600, 700)

**Example:**
```jsx
<h1 className="font-heading">Heading with Poppins</h1>
<p className="font-body">Body text with Inter</p>
```

### Font Sizes

| Size | Value | Usage |
|------|-------|-------|
| xs | 0.75rem (12px) | Small labels, captions |
| sm | 0.875rem (14px) | Secondary text |
| base | 1rem (16px) | Body text |
| lg | 1.125rem (18px) | Large body text |
| xl | 1.25rem (20px) | Small headings |
| 2xl | 1.5rem (24px) | Section headings |
| 3xl | 1.875rem (30px) | Page headings |
| 4xl | 2.25rem (36px) | Hero headings |
| 5xl | 3rem (48px) | Large hero headings |
| 6xl | 3.75rem (60px) | Extra large headings |

### Font Weights

- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings, strong emphasis

### Usage

Typography tokens are exported from `frontend/src/styles/design-tokens/typography.js`:

```javascript
import typography from '@/styles/design-tokens/typography';
// or
import { typography } from '@/styles/design-tokens/typography';
```

#### Tailwind CSS Classes

- Use `font-heading` for headings (applies Poppins)
- Use `font-body` for body text (applies Inter)
- Default body font is Inter (configured in `index.css`)

Example:
```jsx
<h1 className="font-heading text-3xl font-bold">Heading</h1>
<p className="font-body text-base">Body text</p>
```

## Spacing

### Spacing Scale

The spacing system uses a 4px base unit for consistent vertical and horizontal spacing throughout the application.

| Token | Value | Pixels | Spacing Between | Padding Inside |
|-------|-------|--------|----------------|----------------|
| xs | `0.25rem` | 4px | <div style="display: flex; flex-direction: column; gap: 4px;"><div style="display: flex; align-items: center; gap: 4px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 4px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 40px; height: 40px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 4px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |
| sm | `0.5rem` | 8px | <div style="display: flex; flex-direction: column; gap: 8px;"><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 40px; height: 40px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 8px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |
| md | `0.75rem` | 12px | <div style="display: flex; flex-direction: column; gap: 12px;"><div style="display: flex; align-items: center; gap: 12px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 12px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 50px; height: 50px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 12px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |
| base | `1rem` | 16px | <div style="display: flex; flex-direction: column; gap: 16px;"><div style="display: flex; align-items: center; gap: 16px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 16px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 50px; height: 50px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 16px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |
| lg | `1.5rem` | 24px | <div style="display: flex; flex-direction: column; gap: 24px;"><div style="display: flex; align-items: center; gap: 24px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 24px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 60px; height: 60px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 24px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |
| xl | `2rem` | 32px | <div style="display: flex; flex-direction: column; gap: 32px;"><div style="display: flex; align-items: center; gap: 32px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 32px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 70px; height: 70px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 32px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |
| 2xl | `3rem` | 48px | <div style="display: flex; flex-direction: column; gap: 48px;"><div style="display: flex; align-items: center; gap: 48px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 48px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 90px; height: 90px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 48px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |
| 3xl | `4rem` | 64px | <div style="display: flex; flex-direction: column; gap: 64px;"><div style="display: flex; align-items: center; gap: 64px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div><div style="display: flex; align-items: center; gap: 64px;"><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div><div style="width: 25px; height: 25px; background-color: #80b3b4; border: 1px solid #454f59;"></div></div></div> | <div style="width: 110px; height: 110px; background-color: #d5e0e1; border: 1px solid #454f59; padding: 64px; box-sizing: border-box;"><div style="width: 100%; height: 100%; background-color: #80b3b4;"></div></div> |

### Visual Spacing Scale

```
xs (4px)   █
sm (8px)   ██
md (12px)  ███
base (16px)████
lg (24px)  ██████
xl (32px)  ████████
2xl (48px) ████████████
3xl (64px) ████████████████
```

### Container Max-Widths

Container max-widths define the maximum width of content containers at different breakpoints.

| Size | Value | Pixels | Usage |
|------|-------|--------|-------|
| sm | `40rem` | 640px | Small containers, forms |
| md | `48rem` | 768px | Medium containers, cards |
| lg | `64rem` | 1024px | Large containers, main content |
| xl | `80rem` | 1280px | Extra large containers, wide layouts |

### Breakpoints

Breakpoints define the responsive design breakpoints for mobile-first design.

| Breakpoint | Value | Pixels | Usage |
|------------|-------|--------|-------|
| mobile | `20rem` | 320px | Small mobile devices |
| tablet | `48rem` | 768px | Tablets and small laptops |
| desktop | `64rem` | 1024px | Desktop screens |
| wide | `90rem` | 1440px | Large desktop screens |

### Usage

Spacing tokens are exported from `frontend/src/styles/design-tokens/spacing.js`:

```javascript
import spacing from '@/styles/design-tokens/spacing';
// or
import { spacing, containerMaxWidths, breakpoints } from '@/styles/design-tokens/spacing';
```

#### Example Usage

```jsx
// Using spacing tokens
<div style={{ padding: spacing.spacing.base }}>Content</div>
<div style={{ marginTop: spacing.spacing.lg }}>Spaced element</div>

// Using container max-widths
<div style={{ maxWidth: spacing.containerMaxWidths.lg, margin: '0 auto' }}>
  Centered container
</div>

// Using breakpoints in media queries
@media (min-width: ${spacing.breakpoints.tablet}) {
  /* Tablet styles */
}
```

#### Common Spacing Patterns

- **Component padding**: Use `base` (16px) for standard padding
- **Section spacing**: Use `lg` (24px) or `xl` (32px) for vertical spacing between sections
- **Card spacing**: Use `md` (12px) or `base` (16px) for internal card spacing
- **Tight spacing**: Use `xs` (4px) or `sm` (8px) for compact layouts
- **Large spacing**: Use `2xl` (48px) or `3xl` (64px) for hero sections and major separations

## Components
