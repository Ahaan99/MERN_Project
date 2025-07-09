import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import axios from "@/lib/axios";

export function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    newsletterSubscription: false,
    twoFactorAuth: false,
    darkMode: false,
  });

  const handleToggle = async (setting) => {
    setIsLoading(true);
    try {
      const newValue = !settings[setting];
      // In a real app, you would update these settings in the backend
      // await axios.put("/api/users/settings", { [setting]: newValue });

      setSettings((prev) => ({ ...prev, [setting]: newValue }));
      toast.success("Setting updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update setting");
    } finally {
      setIsLoading(false);
    }
  };

  const settingsConfig = [
    {
      title: "Email Notifications",
      description: "Receive email notifications about your account activity",
      key: "emailNotifications",
    },
    {
      title: "Order Updates",
      description: "Get notifications about your order status",
      key: "orderUpdates",
    },
    {
      title: "Promotional Emails",
      description: "Receive emails about promotions and discounts",
      key: "promotionalEmails",
    },
    {
      title: "Newsletter Subscription",
      description: "Subscribe to our monthly newsletter",
      key: "newsletterSubscription",
    },
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      key: "twoFactorAuth",
    },
    {
      title: "Dark Mode",
      description: "Enable dark mode for better visibility in low light",
      key: "darkMode",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settingsConfig.map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between space-x-2"
            >
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{setting.title}</p>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={settings[setting.key]}
                onCheckedChange={() => handleToggle(setting.key)}
                disabled={isLoading}
                aria-label={setting.title}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>
            Manage your privacy settings and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Data Usage</h4>
              <p className="text-sm text-gray-500">
                We collect and use your data to improve your shopping
                experience. You can manage how we use your data below.
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Analytics Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Allow us to analyze how you use our platform
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage Settings
              </Button>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Cookie Preferences</p>
                <p className="text-sm text-muted-foreground">
                  Manage your cookie settings
                </p>
              </div>
              <Button variant="outline" size="sm">
                Update Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            Manage your account data and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Download Your Data</p>
                <p className="text-sm text-muted-foreground">
                  Get a copy of your personal data
                </p>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-red-600">
                  Delete Account
                </p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
