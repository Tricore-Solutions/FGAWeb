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

## Components
