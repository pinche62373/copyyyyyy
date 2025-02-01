# Tailwind Component Export Strategy

We need a way to share our UI components across apps while allowing each app to customize styles. Since we can't bundle these as libraries, we'll export just the styling configurations that each app can implement.

## The Problem

- Need consistent base components across apps
- Each app needs to customize styles
- Must work with Tailwind's compilation
- Keep it simple (KISS)

## The Solution

Export base styles using tailwind-variants (tv), let each app implement components with these styles.

### 1. Shared Code

```typescript
// shared/components/card.ts
import { tv } from 'tailwind-variants'

export const baseCard = tv({
  base: "rounded-lg border shadow",
  variants: {
    intent: {
      primary: "bg-white border-gray-200",
      secondary: "bg-gray-50 border-gray-300"
    },
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6"
    }
  },
  defaultVariants: {
    intent: "primary",
    size: "md"
  }
})

export type BaseCardVariants = VariantProps<typeof baseCard>
```

### 2. Using in Your App

```typescript
// your-app/components/ui/Card.tsx
import { baseCard } from '@shared/components/card'

// Use as-is
const Card = ({ intent, size, className, ...props }) => (
  <div className={baseCard({ intent, size, className })} {...props} />
)

// Direct override example - keeping base styles but changing specific properties
<Card 
  intent="primary"
  size="md"
  className="bg-blue-100 border-blue-200" // These will override the intent's bg/border
/>

// Another example combining overrides with utilities
<Card 
  intent="secondary"
  size="lg"
  className="shadow-xl hover:bg-gray-100" // Add shadow and hover, keep other styles
/>

// Or extend with app-specific styles
const appCard = tv({
  extend: baseCard,
  variants: {
    intent: {
      primary: "bg-brand-50 border-brand-100",  // Override existing
      danger: "bg-red-50 border-red-200"        // Add new variant
    }
  }
})
```

## Why This Works

- Each app gets Tailwind classes as strings
- Apps can use these classes as-is or extend them
- Tailwind processes each app independently
- TypeScript ensures consistency
- No extra build steps needed

## Also Considered

We also looked at CSS variables, CSS-in-JS, and Tailwind presets, but this approach won out for its simplicity and flexibility.
