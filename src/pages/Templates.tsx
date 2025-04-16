
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchTemplates } from "@/services/api";
import { Template } from "@/types/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TemplatePreviewDialog from "@/components/TemplatePreviewDialog";

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Message Templates</h1>
        <div className="p-4 border rounded-lg bg-red-50 text-red-700">
          Error loading templates: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.templates.map((template: Template) => (
            <Card 
              key={template.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTemplateClick(template)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription>Category: {template.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end space-x-2">
                  <Badge variant="outline" className={getStatusBadgeClass(template.status)}>
                    {template.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.templates && data.templates.length === 0 && (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No templates found. Create your first template!</p>
        </div>
      )}

      <TemplatePreviewDialog
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default Templates;
