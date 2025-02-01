# Design Decision - Components vs. UI

## Overview

This document outlines the architectural decision and organization principles for separating our React components into `/ui` and `/components` folders.

## Detailed Structure

### `/ui` Folder

Contains fundamental, reusable building blocks with minimal to no business logic. These components are design-system oriented and could theoretically be used in any React project.

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

### `/components` Folder

Contains business-logic specific and feature-specific components that combine multiple UI elements. These components are contextual to the application and often connect directly to data or state management.

Examples:

- UserDashboard
- ProductCatalog
- ShoppingCart
- PaymentForm
- CommentSection
- NotificationCenter

## Code Example

Here's an example showing how a business component (UserProfile) typically combines multiple UI components (Avatar, Heading, Badge, Card, Alert, and Skeleton):

```typescript
import { Avatar } from '@/ui/avatar';
import { Heading } from '@/ui/heading';
import { Badge } from '@/ui/badge';s
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';

interface User {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'online' | 'offline' | 'away';
}

const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Business logic for fetching user
  useEffect(() => {
    fetchUserData(userId)
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton />
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-4">
        <Alert variant="error">User not found</Alert>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Avatar 
          src={user.avatarUrl} 
          alt={user.name}
          size="lg"
        />
        <div>
          <Heading size="lg">{user.name}</Heading>
          <Badge 
            variant={user.status === 'online' ? 'success' : 'neutral'}
          >
            {user.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
};
```

## Key Distinctions

1. **Business Logic vs. Presentation**
   - UI components focus on presentation and user interaction
   - Components handle business logic, data fetching, and state management

2. **Reusability**
   - UI components are highly reusable across different projects
   - Components are specific to the application's features and requirements

3. **Dependencies**
   - UI components should have minimal dependencies
   - Components can depend on UI components and external services

4. **Testing**
   - UI components focus on visual regression and interaction tests
   - Components require integration tests with data and business logic

## Implementation Guidelines

1. Keep UI components pure and free of business logic
2. Use TypeScript interfaces to ensure proper prop usage
3. Document UI components with clear examples and prop definitions
4. Follow consistent naming conventions
5. Maintain a clear separation of concerns between layers

## Benefits

- **Maintainability**: Clear separation of concerns makes code easier to maintain
- **Reusability**: UI components can be shared across projects
- **Consistency**: Standardized UI components ensure consistent user experience
- **Development Speed**: Reduced duplication and clear structure speeds up development
- **Testing**: Simplified testing strategy for each layer
