
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-xl">{template.name}</CardTitle>
              <CardDescription>Status: {template.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <span className={`px-2 py-1 text-sm rounded ${
                  template.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  template.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
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
