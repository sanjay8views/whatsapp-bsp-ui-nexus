
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Templates = () => {
  // Placeholder data for templates
  const templates = [
    { id: 1, name: "Welcome Message", status: "Approved" },
    { id: 2, name: "Order Confirmation", status: "Pending" },
    { id: 3, name: "Support Ticket", status: "In Review" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Message Templates</h1>
        <Link to="/templates/new">
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Create Template
          </Button>
        </Link>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-xl">{template.name}</CardTitle>
              <CardDescription>Status: {template.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <span className={`status-badge ${
                  template.status === 'Approved' ? 'status-approved' : 
                  template.status === 'Pending' ? 'status-pending' : 
                  'status-review'
                }`}>
                  {template.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;
