# Business Components

## Overview

This document describes the design principals for `/components` folder.

For information about UI Components, please refer to [/app/ui/README.md](../ui/README.md).

## Detailed Structure

The `/components` folder contains business-logic specific and feature-specific components that combine multiple UI elements.

These components are contextual to the application and often connect directly to data or state management.

Examples:

- UserDashboard
- ProductCatalog
- ShoppingCart
- PaymentForm
- CommentSection
- NotificationCenter

## Code Example

Here's an example of a business component combining multiple UI elements:

```typescript
import { Card } from '@/ui/card';
import { Heading } from '@/ui/heading';
import { Alert } from '@/ui/alert';

interface DashboardMetricsProps {
  departmentId: string;
}

export const DashboardMetrics = ({ departmentId }: DashboardMetricsProps) => {
  const { data, error, loading } = useDepartmentMetrics(departmentId);

  if (loading) {
    return <Card><LoadingSpinner /></Card>;
  }

  if (error) {
    return <Alert variant="error">{error.message}</Alert>;
  }

  return (
    <Card>
      <Heading>Department Metrics</Heading>
      {/* Business logic and data visualization */}
    </Card>
  );
};
```

## Key Distinctions

1. **Business Logic Integration**
   - Components handle complex business logic
   - Manage data fetching and state
   - Implement feature-specific requirements

2. **Application Specific**
   - Components are tailored to application needs
   - Can depend on multiple UI components and services

3. **Testing**
   - Focus on integration testing with data and business logic
   - Test complex user interactions and state management

## Implementation Guidelines

1. Compose UI components to build features
2. Keep business logic separate from presentation
3. Use TypeScript for type safety
4. Document component dependencies and requirements
5. Follow established data fetching patterns

## Benefits

- **Feature Encapsulation**: Business logic is contained and organized
- **Clear Dependencies**: Structured relationship with UI components
- **Maintainability**: Separation from UI makes updates easier
- **Testing**: Clear boundaries for integration testing
