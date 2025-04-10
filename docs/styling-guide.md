# Styling Guide

## Overview
The Neema application uses Tailwind CSS for styling, with a custom theme configuration and component-based styling approach. This guide outlines the styling conventions and best practices.

## Theme Configuration

### 1. Color Palette
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#007AFF',
          600: '#0062CC',
          700: '#004999',
          800: '#003166',
          900: '#001833',
        },
        secondary: {
          DEFAULT: '#6B7280',
          // ... similar structure
        },
        // ... other color definitions
      },
    },
  },
}
```

### 2. Typography
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        // ... other custom sizes
      },
    },
  },
}
```

### 3. Spacing and Layout
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        // ... other custom spacing
      },
      maxWidth: {
        '8xl': '88rem',
        // ... other custom max-widths
      },
    },
  },
}
```

## Component Styling

### 1. Base Components
```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 2. Layout Components
```typescript
// components/ui/container.tsx
const containerVariants = cva(
  "mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
      },
    },
    defaultVariants: {
      size: "xl",
    },
  }
)
```

## Utility Classes

### 1. Common Utilities
```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <div>Left content</div>
  <div>Right content</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Grid item 1</div>
  <div>Grid item 2</div>
  <div>Grid item 3</div>
</div>

<!-- Spacing -->
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 2. Responsive Design
```html
<!-- Responsive classes -->
<div class="w-full md:w-1/2 lg:w-1/3">
  Responsive content
</div>

<!-- Responsive padding -->
<div class="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

## Best Practices

### 1. Component Styling
- Use component variants for consistent styling
- Follow the single responsibility principle
- Keep styles modular and reusable
- Use semantic class names

### 2. Responsive Design
- Mobile-first approach
- Use breakpoint prefixes consistently
- Test on multiple devices
- Consider performance implications

### 3. Accessibility
- Maintain proper contrast ratios
- Use semantic HTML elements
- Ensure keyboard navigation
- Test with screen readers

## Custom Utilities

### 1. Animation
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
      },
      animation: {
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
}
```

### 2. Custom Components
```typescript
// components/ui/card.tsx
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

## Theme Customization

### 1. Dark Mode
```typescript
// tailwind.config.ts
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
      },
    },
  },
}
```

### 2. Custom Properties
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other custom properties */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode custom properties */
}
```

## Future Enhancements

### 1. Planned Features
- Additional color schemes
- More animation utilities
- Enhanced responsive utilities
- Advanced theming options

### 2. Improvements
- Better dark mode support
- More accessibility features
- Performance optimizations
- Additional component variants 