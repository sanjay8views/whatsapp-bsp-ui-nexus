
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Wifi, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectToFacebook = () => {
    setIsConnecting(true);
    
    // Define the Facebook permissions we need
    const permissions = [
      'pages_messaging', 
      'pages_show_list', 
      'pages_manage_metadata', 
      'business_management'
    ].join(',');
    
    // Facebook App ID - this will need to be replaced with your actual app ID
    const appId = 'YOUR_FACEBOOK_APP_ID';
    
    // The URL to redirect back to after authentication
    const redirectUri = encodeURIComponent(window.location.origin + '/facebook-callback');
    
    // Construct the Facebook login URL with required parameters
    const facebookLoginUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${generateRandomState()}&scope=${permissions}&response_type=code`;

    // Open Facebook login in a new window
    window.open(facebookLoginUrl, 'facebook_login', 'width=600,height=700');

    // Add event listener for message from popup window
    window.addEventListener('message', handleFacebookCallback, false);
  };

  // Generate a random state to prevent CSRF
  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Handle the callback from Facebook
  const handleFacebookCallback = async (event: MessageEvent) => {
    // Verify the origin to ensure it's from our popup
    if (event.origin !== window.location.origin) return;

    // Get the code from the response
    const { code } = event.data;
    if (!code) return;

    setIsConnecting(false);
    window.removeEventListener('message', handleFacebookCallback);

    // Exchange code for access token
    try {
      console.log("Received authorization code:", code);
      
      // This would typically be a server-side operation due to the need for client_secret
      // For now, we'll simulate the request
      
      // Normally, you'd send this to your backend:
      const backendRequest = {
        code,
        userId: user?.id
      };
      console.log("Would send to backend:", backendRequest);
      
      // Here you would normally call your backend API endpoint
      // const response = await fetch('YOUR_BACKEND_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(backendRequest)
      // });
      // const data = await response.json();
      
      // Instead, we'll simulate a successful response
      toast({
        title: "Connected to Facebook",
        description: "Your Facebook business account has been successfully connected.",
      });
      
      // In a real implementation, you would save the WABA ID, phone ID, and access token
      // received from your backend after it exchanges the code
    } catch (error) {
      console.error("Error connecting to Facebook:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to Facebook. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="h-6 w-6 text-whatsapp-primary" />
            </div>
            <div>
              <CardTitle>WhatsApp Number</CardTitle>
              <CardDescription>Status: Active</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">+1 234 567 8900</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wifi className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>API Status</CardTitle>
              <CardDescription>All systems operational</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Facebook className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Facebook Connection</CardTitle>
              <CardDescription>Connect your business account</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="outline"
              disabled={isConnecting}
              onClick={connectToFacebook}
            >
              {isConnecting ? "Connecting..." : "Connect to Facebook"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
