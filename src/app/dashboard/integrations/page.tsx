"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useIntegrations } from '@/context/IntegrationContext';
import { useToast } from '@/hooks/use-toast';

export default function IntegrationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { 
    status, 
    isLoading, 
    refreshStatus,
    connectNotion, 
    connectGoogle, 
    connectLinkedIn,
    disconnectNotion, 
    disconnectGoogle, 
    disconnectLinkedIn 
  } = useIntegrations();
  
  const [connecting, setConnecting] = useState<{
    notion: boolean;
    google: boolean;
    linkedin: boolean;
  }>({
    notion: false,
    google: false,
    linkedin: false
  });

  // Redirects for OAuth flows
  const baseRedirectUrl = typeof window !== 'undefined' ? 
    `${window.location.origin}/dashboard/integrations/callback` : '';

  const handleConnect = async (service: 'notion' | 'google' | 'linkedin') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to connect services',
        variant: 'destructive'
      });
      return;
    }

    setConnecting(prev => ({ ...prev, [service]: true }));

    try {
      let authUrl;
      const redirectUrl = `${baseRedirectUrl}?service=${service}`;
      
      switch (service) {
        case 'notion':
          authUrl = await connectNotion(redirectUrl);
          break;
        case 'google':
          // Request appropriate scopes for Google services
          const googleScopes = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
          ];
          authUrl = await connectGoogle(redirectUrl, googleScopes);
          break;
        case 'linkedin':
          authUrl = await connectLinkedIn(redirectUrl);
          break;
      }

      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error(`Error connecting to ${service}:`, error);
      toast({
        title: 'Connection error',
        description: `Failed to connect to ${service}`,
        variant: 'destructive'
      });
    } finally {
      setConnecting(prev => ({ ...prev, [service]: false }));
    }
  };

  const handleDisconnect = async (service: 'notion' | 'google' | 'linkedin') => {
    if (!user) return;
    
    setConnecting(prev => ({ ...prev, [service]: true }));
    
    try {
      let success = false;
      
      switch (service) {
        case 'notion':
          success = await disconnectNotion();
          break;
        case 'google':
          success = await disconnectGoogle();
          break;
        case 'linkedin':
          success = await disconnectLinkedIn();
          break;
      }
      
      if (success) {
        await refreshStatus();
      }
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error);
    } finally {
      setConnecting(prev => ({ ...prev, [service]: false }));
    }
  };

  // Process OAuth callback parameters from URL if present
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const service = url.searchParams.get('service');
    const error = url.searchParams.get('error');

    // Clear URL parameters
    if (code || error) {
      window.history.replaceState({}, document.title, '/dashboard/integrations');
    }

    // Refresh integration status
    refreshStatus();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Integrations</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Connect your accounts to enhance Neema&apos;s capabilities
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Notion Integration Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src="/notion-logo.svg" alt="Notion" className="h-6 w-6 mr-2" />
              Notion
              {isLoading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : status.notion ? (
                <Check className="ml-2 h-4 w-4 text-green-500" />
              ) : null}
            </CardTitle>
            <CardDescription>
              Connect with Notion to sync your workspace pages, databases, and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Connection Status</span>
              <Switch 
                checked={status.notion}
                disabled={isLoading || connecting.notion}
                onCheckedChange={() => {
                  if (status.notion) {
                    handleDisconnect('notion');
                  } else {
                    handleConnect('notion');
                  }
                }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant={status.notion ? "outline" : "default"}
              onClick={() => {
                if (status.notion) {
                  handleDisconnect('notion');
                } else {
                  handleConnect('notion');
                }
              }}
              disabled={isLoading || connecting.notion}
              className="w-full"
            >
              {connecting.notion ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {status.notion ? 'Disconnecting...' : 'Connecting...'}
                </>
              ) : status.notion ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Google Integration Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src="/google-logo.svg" alt="Google" className="h-6 w-6 mr-2" />
              Google
              {isLoading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : status.google.connected ? (
                <Check className="ml-2 h-4 w-4 text-green-500" />
              ) : null}
            </CardTitle>
            <CardDescription>
              Connect with Google to access Calendar, Gmail, and other services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Connection Status</span>
              <Switch 
                checked={status.google.connected}
                disabled={isLoading || connecting.google}
                onCheckedChange={() => {
                  if (status.google.connected) {
                    handleDisconnect('google');
                  } else {
                    handleConnect('google');
                  }
                }}
              />
            </div>
            {status.google.connected && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Connected scopes:</p>
                <ul className="text-xs mt-1">
                  {status.google.scopes.map((scope, index) => (
                    <li key={index} className="truncate">{scope.split('/').pop()}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant={status.google.connected ? "outline" : "default"}
              onClick={() => {
                if (status.google.connected) {
                  handleDisconnect('google');
                } else {
                  handleConnect('google');
                }
              }}
              disabled={isLoading || connecting.google}
              className="w-full"
            >
              {connecting.google ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {status.google.connected ? 'Disconnecting...' : 'Connecting...'}
                </>
              ) : status.google.connected ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* LinkedIn Integration Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src="/linkedin-logo.svg" alt="LinkedIn" className="h-6 w-6 mr-2" />
              LinkedIn
              {isLoading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : status.linkedin ? (
                <Check className="ml-2 h-4 w-4 text-green-500" />
              ) : null}
            </CardTitle>
            <CardDescription>
              Connect with LinkedIn to access profile, connections, and messaging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Connection Status</span>
              <Switch 
                checked={status.linkedin}
                disabled={isLoading || connecting.linkedin}
                onCheckedChange={() => {
                  if (status.linkedin) {
                    handleDisconnect('linkedin');
                  } else {
                    handleConnect('linkedin');
                  }
                }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant={status.linkedin ? "outline" : "default"}
              onClick={() => {
                if (status.linkedin) {
                  handleDisconnect('linkedin');
                } else {
                  handleConnect('linkedin');
                }
              }}
              disabled={isLoading || connecting.linkedin}
              className="w-full"
            >
              {connecting.linkedin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {status.linkedin ? 'Disconnecting...' : 'Connecting...'}
                </>
              ) : status.linkedin ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 