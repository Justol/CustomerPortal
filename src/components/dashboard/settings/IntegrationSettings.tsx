import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ExternalLink } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected';
  icon: string;
}

export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const { toast } = useToast();

  const toggleIntegration = async (id: string, currentStatus: string) => {
    try {
      // Implement integration toggle logic
      toast({
        title: "Integration Updated",
        description: `Integration has been ${currentStatus === 'connected' ? 'disconnected' : 'connected'} successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update integration.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={integration.icon}
                  alt={integration.name}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{integration.name}</h3>
                    <Badge variant={integration.status === 'connected' ? 'success' : 'secondary'}>
                      {integration.status === 'connected' ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {integration.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  checked={integration.status === 'connected'}
                  onCheckedChange={() => toggleIntegration(integration.id, integration.status)}
                />
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="outline">
          Browse More Integrations
        </Button>
      </div>
    </div>
  );
}