import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Settings, Bell, Palette, Layout } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const UserProfile = () => {
  const { user } = useUser();
  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <Card className="border shadow-sm bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>Profile Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">
              <User className="h-4 w-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-neema-primary data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-1" />
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
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 rounded-full bg-neema-primary/20 flex items-center justify-center text-2xl font-bold text-neema-primary">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-medium">{firstName} {lastName}</h3>
                <p className="text-muted-foreground">{email}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Avatar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={lastName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Product Manager" />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Dashboard Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Notion Notes</h4>
                    <p className="text-sm text-muted-foreground">Display your Notion notes in the dashboard</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Calendar</h4>
                    <p className="text-sm text-muted-foreground">Display your calendar events in the dashboard</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show Time Tracker</h4>
                    <p className="text-sm text-muted-foreground">Display the time tracker in the dashboard header</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button>Save Preferences</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Task Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get reminders for upcoming task deadlines</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Meeting Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get reminders for upcoming meetings</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button>Save Notification Settings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <select 
                    id="fontSize" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="medium"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select 
                    id="theme" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="default"
                  >
                    <option value="default">Default</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button>Save Appearance Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserProfile; 