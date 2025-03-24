
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Webhook } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WebhookConfig {
  url: string;
  events: string[];
}

const Integrations = () => {
  const { toast } = useToast();
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    url: "",
    events: ["message.received", "message.sent", "template.sent"]
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookConfig(prev => ({ ...prev, url: e.target.value }));
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookConfig.url) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Success",
        description: "Webhook configuration saved successfully",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Integrations</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            <CardTitle>Webhook Integration</CardTitle>
          </div>
          <CardDescription>
            Configure webhook to receive notifications for various events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveWebhook} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-webhook-endpoint.com/callback"
                value={webhookConfig.url}
                onChange={handleWebhookUrlChange}
              />
              <p className="text-sm text-muted-foreground">
                We'll send POST requests to this URL when events occur
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Events</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {webhookConfig.events.map(event => (
                  <div key={event} className="flex items-center p-2 border rounded">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
