import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  context?: string;
  userId: string;
}

// Configure axios with the API key
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

export const fetchTasks = async (userId: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/tasks`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  try {
    const response = await api.post(`/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    return null;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    await api.delete(`/tasks/${taskId}`);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

// Get tasks by priority
export const fetchTasksByPriority = async (userId: string, priority: string): Promise<Task[]> => {
  try {
    const response = await api.get(`/tasks`, {
      params: { userId, priority }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks by priority:', error);
    return [];
  }
};

// Get statistics on task completion
export const fetchTaskStats = async (userId: string): Promise<{
  total: number;
  completed: number;
  highPriority: number;
  overdueCount: number;
}> => {
  try {
    const response = await api.get(`/tasks/stats`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return {
      total: 0,
      completed: 0,
      highPriority: 0,
      overdueCount: 0
    };
  }
}; 