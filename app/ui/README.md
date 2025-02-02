# UI Components

## Overview

This document describes the design principles for the `/ui` folder.

For information about Business Components, please refer to [/app/components/README.md](../components/README.md).

## Detailed Structure

The `/ui` folder contains fundamental, reusable building blocks with minimal to no business logic.

These components are design-system oriented and could theoretically be used in any React project.

Examples:

- Button
- Card
- Form
- Input
- TextArea
- Avatar
- Heading
- Badge
- Alert
- Modal
- Tooltip

## Code Example

Here's an example of a typical UI component (Button):

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ 
  variant = 'primary',
  size = 'md',
  children,
  onClick
}: ButtonProps) => {
  return (
    <button 
      className={cn(
        buttonVariants({ variant, size })
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## Key Distinctions

1. **Focus on Presentation**
   - UI components prioritize presentation and user interaction
   - Keep components pure and free of business logic

2. **High Reusability**
   - Components should be usable across different projects
   - Maintain minimal external dependencies

3. **Testing**
   - Focus on visual regression and interaction tests
   - Ensure proper prop handling and accessibility

## Implementation Guidelines

1. Keep components pure and free of business logic
2. Use TypeScript interfaces to ensure proper prop usage
3. Document components with clear examples and prop definitions
4. Follow consistent naming conventions
5. Maintain minimal dependencies

## Benefits

- **Reusability**: Components can be shared across projects
- **Consistency**: Standardized components ensure consistent user experience
- **Testing**: Simplified testing focused on presentation and interaction
- **Maintainability**: Pure components are easier to maintain and update
