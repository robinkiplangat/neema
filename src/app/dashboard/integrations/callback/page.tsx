"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useIntegrations } from '@/context/IntegrationContext';

export default function IntegrationCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  
  const { 
    completeNotionConnection, 
    completeGoogleConnection, 
    completeLinkedInConnection
  } = useIntegrations();

  useEffect(() => {
    const handleCallback = async () => {
      // Get the service, code, and error from the URL
      const serviceParam = searchParams.get('service');
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const state = searchParams.get('state');

      // Set the service
      setService(serviceParam);

      // If there's an error in the URL or required params are missing
      if (errorParam) {
        setStatus('error');
        setError(errorParam);
        return;
      }

      if (!serviceParam || !code) {
        setStatus('error');
        setError('Missing required parameters');
        return;
      }

      try {
        let success = false;
        
        // Handle each service
        switch (serviceParam.toLowerCase()) {
          case 'notion':
            success = await completeNotionConnection(code);
            break;
          case 'google':
            success = await completeGoogleConnection(code, state);
            break;
          case 'linkedin':
            success = await completeLinkedInConnection(code, state);
            break;
          default:
            setStatus('error');
            setError(`Unsupported service: ${serviceParam}`);
            return;
        }

        if (success) {
          setStatus('success');
        } else {
          setStatus('error');
          setError('Failed to complete connection');
        }
      } catch (err) {
        console.error('Error during callback handling:', err);
        setStatus('error');
        setError('An unexpected error occurred');
      }
    };

    handleCallback();
  }, [searchParams, completeNotionConnection, completeGoogleConnection, completeLinkedInConnection]);

  // Redirect after a delay based on status
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        router.push('/dashboard/integrations');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {service ? `${service.charAt(0).toUpperCase() + service.slice(1).toLowerCase()} Integration` : 'Integration'}
          </h1>
          
          {status === 'processing' && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p>Processing your connection...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg font-medium">Connected Successfully!</p>
              <p className="text-sm mt-2">Redirecting you back to integrations...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="text-lg font-medium">Connection Failed</p>
              {error && <p className="text-sm mt-2 break-words">{error}</p>}
              <p className="text-sm mt-2">Redirecting you back to integrations...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 