# API Integration Documentation

## Overview
The Neema application uses React Query for API integration, providing a robust solution for data fetching, caching, and state management. This document outlines the API integration patterns and best practices.

## Environment Variables

### 1. Frontend Environment Variables
All frontend environment variables must be prefixed with `VITE_` to be accessible in the Vite application:

```env
# Core
VITE_API_URL=http://localhost:5000

# AI Services
VITE_OPENROUTER_API_KEY=your-api-key
VITE_OPENROUTER_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
VITE_DEFAULT_MODEL=meta-llama/llama-4-maverick:free

# Integrations
VITE_NOTION_CLIENT_ID=your-client-id
VITE_NOTION_CLIENT_SECRET=your-client-secret

# Authentication
VITE_CLERK_PUBLISHABLE_KEY=your-publishable-key
VITE_CLERK_SECRET_KEY=your-secret-key

# Third-party Services
VITE_LINKEDIN_CLIENT_ID=your-client-id
VITE_LINKEDIN_CLIENT_SECRET=your-client-secret
VITE_GCAL_CLIENT_ID=your-client-id
VITE_GCAL_CLIENT_SECRET=your-client-secret
VITE_GMAIL_KEY_ID=your-key-id
VITE_TWITTER_CLIENT_ID=your-client-id
VITE_TWITTER_CLIENT_SECRET=your-client-secret
```

### 2. Backend Environment Variables
Backend environment variables do not require the `VITE_` prefix:

```env
# Core
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your-mongodb-uri
```

### 3. Accessing Environment Variables
```typescript
// Frontend (Vite)
const apiUrl = import.meta.env.VITE_API_URL;

// Backend (Node.js)
const port = process.env.PORT;
```

## API Client Setup

### 1. React Query Configuration
```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### 2. API Client Configuration
```typescript
// src/lib/api-client.ts
import axios from 'axios'

// Create API client with environment variables
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error)
  }
)
```

## Data Fetching Patterns

### 1. Custom Hooks
```typescript
// src/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users')
      return data
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await apiClient.post('/users', userData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

### 2. Query Keys
```typescript
// src/lib/query-keys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  // ... other query keys
}
```

## Error Handling

### 1. Error Types
```typescript
// src/types/api.ts
export interface ApiError {
  message: string
  code: string
  status: number
}

export interface ValidationError {
  field: string
  message: string
}
```

### 2. Error Handling Hooks
```typescript
// src/hooks/use-api-error.ts
import { useToast } from '@/components/ui/use-toast'

export const useApiError = () => {
  const { toast } = useToast()

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return { handleError }
}
```

## Data Mutations

### 1. Optimistic Updates
```typescript
// src/hooks/use-update-user.ts
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await apiClient.put(`/users/${userData.id}`, userData)
      return data
    },
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users', newUser.id] })
      const previousUser = queryClient.getQueryData(['users', newUser.id])
      
      queryClient.setQueryData(['users', newUser.id], newUser)
      
      return { previousUser }
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users', newUser.id], context?.previousUser)
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
    },
  })
}
```

### 2. Batch Updates
```typescript
// src/hooks/use-batch-update.ts
export const useBatchUpdate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await apiClient.post('/batch-update', updates)
      return data
    },
    onSuccess: (data, variables) => {
      variables.forEach((update) => {
        queryClient.invalidateQueries({ queryKey: ['items', update.id] })
      })
    },
  })
}
```

## Caching Strategies

### 1. Cache Configuration
```typescript
// src/lib/cache-config.ts
export const cacheConfig = {
  defaultStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultCacheTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: false,
  retry: 1,
}
```

### 2. Cache Invalidation
```typescript
// src/hooks/use-cache-invalidation.ts
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient()
  
  const invalidateQueries = (queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey })
  }
  
  const resetQueries = (queryKey: string[]) => {
    queryClient.resetQueries({ queryKey })
  }
  
  return { invalidateQueries, resetQueries }
}
```

## Best Practices

### 1. Query Organization
- Group related queries together
- Use consistent query key patterns
- Implement proper error handling
- Use TypeScript for type safety

### 2. Performance
- Implement proper caching strategies
- Use optimistic updates when appropriate
- Implement proper loading states
- Handle error states gracefully

### 3. Security
- Implement proper authentication
- Handle token refresh
- Validate API responses
- Sanitize user input

## Future Enhancements

### 1. Planned Features
- Real-time updates with WebSocket
- Advanced caching strategies
- Better error handling
- Performance monitoring

### 2. Improvements
- Enhanced type safety
- Better testing support
- More efficient data fetching
- Advanced error recovery 