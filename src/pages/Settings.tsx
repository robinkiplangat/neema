import { useState } from "react";
import AppLayout from "@/components/app/AppLayout";
import PageTitle from "@/components/shared/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Settings as SettingsIcon, Bell, Palette, Key, Link } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const Settings = () => {
  const { user } = useUser();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [notionConnected, setNotionConnected] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>
      <SignedIn>
        <AppLayout>
          <PageTitle title="Settings | Neema" />
          
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="profile" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">
                  <SettingsIcon className="h-4 w-4 mr-1" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">
                  <Bell className="h-4 w-4 mr-1" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">
                  <Palette className="h-4 w-4 mr-1" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">
                  <Link className="h-4 w-4 mr-1" />
                  Integrations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={user?.firstName || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={user?.lastName || ""} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.primaryEmailAddress?.emailAddress || ""} />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                      </div>
                      <Switch checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
                      </div>
                      <Switch checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Manage your appearance settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Appearance content */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Services</CardTitle>
                    <CardDescription>Manage your connected services and integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notion</Label>
                        <p className="text-sm text-muted-foreground">Connect your Notion workspace</p>
                      </div>
                      <Button variant={notionConnected ? "outline" : "default"} onClick={() => setNotionConnected(!notionConnected)}>
                        {notionConnected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Google Calendar</Label>
                        <p className="text-sm text-muted-foreground">Connect your Google Calendar</p>
                      </div>
                      <Button variant={calendarConnected ? "outline" : "default"} onClick={() => setCalendarConnected(!calendarConnected)}>
                        {calendarConnected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </AppLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Settings; 