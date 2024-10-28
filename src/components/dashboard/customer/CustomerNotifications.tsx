import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export function CustomerNotifications() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'new-mail',
      title: 'New Mail Notifications',
      description: 'Get notified when new mail arrives',
      enabled: true,
    },
    {
      id: 'mail-scanned',
      title: 'Mail Scan Notifications',
      description: 'Get notified when mail is scanned',
      enabled: true,
    },
    {
      id: 'mail-forwarded',
      title: 'Mail Forwarding Notifications',
      description: 'Get notified when mail is forwarded',
      enabled: true,
    },
    {
      id: 'package-received',
      title: 'Package Receipt Notifications',
      description: 'Get notified when packages are received',
      enabled: true,
    },
    {
      id: 'package-forwarded',
      title: 'Package Forwarding Notifications',
      description: 'Get notified when packages are forwarded',
      enabled: true,
    },
    {
      id: 'billing',
      title: 'Billing Notifications',
      description: 'Get notified about billing and payments',
      enabled: true,
    },
  ]);

  const handleToggle = async (id: string) => {
    try {
      setSettings(settings.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      ));

      toast({
        title: "Settings Updated",
        description: "Notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings.",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
        <div className="space-y-6">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between space-x-4 border rounded-lg p-4"
            >
              <div>
                <h4 className="font-medium">{setting.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={() => handleToggle(setting.id)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button>Save Preferences</Button>
        </div>
      </div>
    </Card>
  );
}