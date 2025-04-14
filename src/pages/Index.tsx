import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Wifi, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDashboardData, handleFacebookAuth } from "@/services/api";

interface DashboardData {
  phone_number: string;
  business_name: string;
  connected: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data when component mounts
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchDashboardData();
        console.log("Dashboard data:", result);
        
        if (result.success && result.data) {
          setDashboardData(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  const connectToFacebook = () => {
    setIsConnecting(true);
    
    // Define the Facebook permissions we need - using the exact permissions you provided
    const permissions = [
      'business_management',
      'whatsapp_business_management',
      'whatsapp_business_messaging',
      'pages_show_list'
    ].join(',');
    
    // Facebook App ID from your provided value
    const appId = '501863326303161';
    
    // The URL to redirect back to after authentication
    const redirectUri = encodeURIComponent(window.location.origin + '/facebook-callback');
    
    // Generate a random state for CSRF protection
    const state = generateRandomState();
    
    // Store the state in localStorage to verify when the callback happens
    localStorage.setItem('facebook_state', state);
    
    // Construct the Facebook login URL with required parameters
    const facebookLoginUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&scope=${permissions}&response_type=code`;

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

    // Get the code and state from the response
    const { code, state, error } = event.data;
    
    if (error) {
      console.error("Facebook authentication error:", error);
      setIsConnecting(false);
      window.removeEventListener('message', handleFacebookCallback);
      toast({
        title: "Connection failed",
        description: "Facebook authentication was canceled or failed.",
        variant: "destructive",
      });
      return;
    }
    
    // Verify state to prevent CSRF attacks
    const savedState = localStorage.getItem('facebook_state');
    if (!code || !state || state !== savedState) {
      console.error("Invalid state or missing code");
      setIsConnecting(false);
      window.removeEventListener('message', handleFacebookCallback);
      toast({
        title: "Connection failed",
        description: "Authentication verification failed.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.removeItem('facebook_state');
    setIsConnecting(false);
    window.removeEventListener('message', handleFacebookCallback);

    // Exchange code for access token using your backend API
    try {
      console.log("Received authorization code:", code);
      
      // Using the updated API function to handle Facebook callback
      const redirectUriDecoded = window.location.origin + '/facebook-callback';
      const data = await handleFacebookAuth(code, redirectUriDecoded);
      
      toast({
        title: "Connected to Facebook",
        description: "Your Facebook business account has been successfully connected.",
      });
      
      // Update our dashboard data to show as connected
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          connected: true
        });
      } else {
        // If dashboard data wasn't loaded yet, fetch it again
        const result = await fetchDashboardData();
        if (result.success && result.data) {
          setDashboardData(result.data);
        }
      }
    } catch (error) {
      console.error("Error connecting to Facebook:", error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to Facebook. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-whatsapp-primary"></div>
        </div>
      </div>
    );
  }

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
              <CardDescription>
                {dashboardData?.business_name || "Business Name"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardData?.phone_number || "Not connected"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wifi className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>API Status</CardTitle>
              <CardDescription>
                {dashboardData?.connected 
                  ? "All systems operational" 
                  : "Not connected"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 ${dashboardData?.connected ? 'bg-green-500' : 'bg-red-500'} rounded-full`} />
              <span className="text-sm text-gray-600">
                {dashboardData?.connected ? "Live" : "Not Connected"}
              </span>
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
              variant={dashboardData?.connected ? "secondary" : "outline"}
              disabled={dashboardData?.connected || isConnecting}
              onClick={connectToFacebook}
            >
              {isConnecting 
                ? "Connecting..." 
                : dashboardData?.connected 
                  ? "Connected" 
                  : "Connect to Facebook"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
