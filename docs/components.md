# Components Documentation

## Overview
The Neema application uses a component-based architecture with Radix UI primitives and custom components. This document outlines the available components and their usage.

## Component Library

### 1. Base UI Components
Located in `src/components/ui/`

#### Button
```typescript
import { Button } from "@/components/ui/button"

// Usage
<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

#### Input
```typescript
import { Input } from "@/components/ui/input"

// Usage
<Input type="text" placeholder="Enter text" />
<Input type="email" placeholder="Enter email" />
```

#### Card
```typescript
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### 2. Form Components

#### Form
```typescript
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"

// Usage
<Form>
  <FormField>
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input />
      </FormControl>
    </FormItem>
  </FormField>
</Form>
```

#### Select
```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Usage
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### 3. Layout Components

#### Container
```typescript
import { Container } from "@/components/ui/container"

// Usage
<Container>
  <div>Content</div>
</Container>
```

#### Grid
```typescript
import { Grid } from "@/components/ui/grid"

// Usage
<Grid columns={3}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### 4. Feedback Components

#### Toast
```typescript
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

// Usage
const { toast } = useToast()
toast({
  title: "Success",
  description: "Operation completed successfully",
})
```

#### Alert
```typescript
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Usage
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Important information</AlertDescription>
</Alert>
```

## Feature Components

### 1. Authentication Components

#### LoginForm
```typescript
import { LoginForm } from "@/components/auth/login-form"

// Usage
<LoginForm onSubmit={handleLogin} />
```

#### SignupForm
```typescript
import { SignupForm } from "@/components/auth/signup-form"

// Usage
<SignupForm onSubmit={handleSignup} />
```

### 2. Dashboard Components

#### DashboardCard
```typescript
import { DashboardCard } from "@/components/dashboard/dashboard-card"

// Usage
<DashboardCard
  title="Statistics"
  value="100"
  icon={<Icon />}
/>
```

#### DashboardChart
```typescript
import { DashboardChart } from "@/components/dashboard/dashboard-chart"

// Usage
<DashboardChart data={chartData} />
```

### 3. Timesheet Components

#### TimeEntry
```typescript
import { TimeEntry } from "@/components/timesheet/time-entry"

// Usage
<TimeEntry
  startTime={startTime}
  endTime={endTime}
  description="Work description"
/>
```

#### TimeTracker
```typescript
import { TimeTracker } from "@/components/timesheet/time-tracker"

// Usage
<TimeTracker onTimeUpdate={handleTimeUpdate} />
```

### 4. Kanban Components

#### KanbanBoard
```typescript
import { KanbanBoard } from "@/components/kanban/kanban-board"

// Usage
<KanbanBoard columns={columns} tasks={tasks} />
```

#### KanbanCard
```typescript
import { KanbanCard } from "@/components/kanban/kanban-card"

// Usage
<KanbanCard task={task} />
```

## Styling

### 1. Theme Configuration
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
      },
    },
  },
}
```

### 2. Component Variants
```typescript
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

## Best Practices

### 1. Component Usage
- Use appropriate component variants
- Follow accessibility guidelines
- Implement proper error handling
- Use TypeScript for type safety

### 2. Performance
- Implement proper memoization
- Use lazy loading when appropriate
- Optimize re-renders
- Follow React best practices

### 3. Accessibility
- Use semantic HTML
- Implement ARIA attributes
- Ensure keyboard navigation
- Maintain proper contrast ratios

## Future Enhancements

### 1. Planned Components
- Advanced data tables
- Rich text editor
- File upload components
- Advanced charts

### 2. Improvements
- Enhanced animations
- Additional themes
- More customization options
- Better accessibility support 