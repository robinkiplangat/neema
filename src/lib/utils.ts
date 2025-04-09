import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Clerk CAPTCHA settings - for documentation 
export const clerkCaptchaSettings = {
  // These are the default settings, documented here for reference
  captchaUrl: "https://challenges.cloudflare.com",
  captchaConfig: {
    renderMethod: "local", // Use 'local' to render in our own containers
    elementId: {
      signUp: "clerk-captcha", // The ID of the element to render the CAPTCHA in for sign up
      signIn: null, // We don't use CAPTCHA for sign in
    }
  }
};
