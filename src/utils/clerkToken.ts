// Utility to get Clerk JWT token for API requests
// Works in both React and non-React contexts

// If using Clerk React, prefer to use useAuth() in components
/**
 * Get Clerk JWT token for API requests.
 * Uses window.Clerk if available (browser context).
 */
export async function getToken(): Promise<string | null> {
  const w = window as any;
  if (w.Clerk && w.Clerk.session && typeof w.Clerk.session.getToken === 'function') {
    return await w.Clerk.session.getToken();
  }
  // If you have a custom auth context, add logic here
  return null;
}
