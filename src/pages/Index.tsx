
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Wifi, Facebook } from "lucide-react";

const Index = () => {
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
            <Button className="w-full" variant="outline">
              Connect to Facebook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
