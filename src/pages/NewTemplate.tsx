
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTemplate, fetchDashboardData } from "@/services/api";
import { TemplateCreateRequest, TemplateButton, TemplateVariable } from "@/types/chat";
import { useNavigate } from "react-router-dom";

interface LocalTemplateVariable {
  id: string;
  placeholder: string;
  example: string;
}

interface LocalTemplateButton {
  type: "url" | "call" | "quick_reply";
  text: string;
  value?: string;
}

const NewTemplate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
  
  const [template, setTemplate] = useState({
    name: "",
    language: "en",
    category: "MARKETING",
    header: "",
    body: "",
    footer: "",
    variables: [] as LocalTemplateVariable[],
    buttons: [] as LocalTemplateButton[]
  });

  const [newButton, setNewButton] = useState<LocalTemplateButton>({
    type: "quick_reply",
    text: "",
    value: ""
  });

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template created successfully",
      });
      navigate("/templates");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create template",
        variant: "destructive",
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setTemplate(prev => ({ ...prev, [id]: value }));
  };

  const addVariable = () => {
    const newVariable: LocalTemplateVariable = {
      id: Date.now().toString(),
      placeholder: "",
      example: ""
    };
    
    const nextVarNumber = template.variables.length + 1;
    const placeholder = `{{${nextVarNumber}}}`;
    
    const updatedBody = template.body + (template.body ? " " : "") + placeholder;
    
    setTemplate(prev => ({
      ...prev,
      body: updatedBody,
      variables: [...prev.variables, newVariable]
    }));
  };

  const updateVariable = (id: string, field: keyof LocalTemplateVariable, value: string) => {
    setTemplate(prev => ({
      ...prev,
      variables: prev.variables.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    }));
  };

  const removeVariable = (id: string) => {
    const variableIndex = template.variables.findIndex(v => v.id === id);
    if (variableIndex === -1) return;
    
    const placeholder = `{{${variableIndex + 1}}}`;
    
    const updatedBody = template.body.replace(placeholder, "");
    
    const updatedVariables = template.variables.filter(v => v.id !== id);
    
    let finalBody = updatedBody;
    updatedVariables.forEach((v, newIndex) => {
      const oldIndex = template.variables.findIndex(oldVar => oldVar.id === v.id);
      if (oldIndex !== newIndex) {
        const oldPlaceholder = `{{${oldIndex + 1}}}`;
        const newPlaceholder = `{{${newIndex + 1}}}`;
        finalBody = finalBody.replace(new RegExp(oldPlaceholder, 'g'), newPlaceholder);
      }
    });
    
    setTemplate(prev => ({
      ...prev,
      body: finalBody,
      variables: updatedVariables
    }));
  };

  const handleButtonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewButton(prev => ({ ...prev, [id]: value }));
  };

  const addButton = () => {
    if (newButton.text.trim() !== "") {
      setTemplate(prev => ({
        ...prev,
        buttons: [...prev.buttons, { ...newButton }]
      }));
      setNewButton({ type: "quick_reply", text: "", value: "" });
    }
  };

  const removeButton = (index: number) => {
    setTemplate(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dashboardData?.data?.phone_number) {
      toast({
        title: "Error",
        description: "Could not retrieve phone number. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    const formattedVariables: TemplateVariable[] = template.variables.map((variable, index) => ({
      variable_name: variable.placeholder || `Variable ${index + 1}`,
      example_value: variable.example || "",
      order_index: index
    }));
    
    // Fixed: Properly type the button_type to match TemplateButton interface
    const formattedButtons: TemplateButton[] = template.buttons.map((button, index) => {
      // Ensure button_type is properly typed as "url" | "call" | "quick_reply"
      const buttonType = button.type as "url" | "call" | "quick_reply";
      
      const baseButton: TemplateButton = {
        button_type: buttonType,
        button_text: button.text,
        order_index: index
      };
      
      // Add button_value only for url or call button types
      if (button.type === "url" || button.type === "call") {
        return {
          ...baseButton,
          button_value: button.value || ""
        };
      }
      
      return baseButton;
    });
    
    const templateRequest: TemplateCreateRequest = {
      phone_number: dashboardData.data.phone_number,
      name: template.name,
      language: template.language,
      category: template.category,
      body_text: template.body,
      ...(template.header && { header_text: template.header }),
      ...(template.footer && { footer_text: template.footer }),
      ...(formattedVariables.length > 0 && { variables: formattedVariables }),
      ...(formattedButtons.length > 0 && { buttons: formattedButtons }),
    };
    
    createTemplateMutation.mutate(templateRequest);
  };

  const replaceVariables = (text: string) => {
    if (!text) return "";
    
    let result = text;
    template.variables.forEach((variable, index) => {
      const placeholder = `{{${index + 1}}}`;
      const replacement = variable.example || placeholder;
      result = result.replace(new RegExp(placeholder, 'g'), replacement);
    });
    
    return result;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Template</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter template name" 
                  value={template.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={template.language}
                    onChange={handleChange}
                  >
                    <option value="en">English</option>
                    <option value="en_US">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="pt_BR">Portuguese (Brazil)</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={template.category}
                    onChange={handleChange}
                  >
                    <option value="MARKETING">Marketing</option>
                    <option value="UTILITY">Utility</option>
                    <option value="AUTHENTICATION">Authentication</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="header">Header</Label>
                <Input 
                  id="header" 
                  placeholder="Enter template header" 
                  value={template.header}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Headers can only contain text or an image URL.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  placeholder="Enter template body. Use {{1}}, {{2}} etc. for variables."
                  className="min-h-[100px]"
                  value={template.body}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Add variables to make your template dynamic. Variables will be inserted into the body.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Variables</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addVariable}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Variable
                  </Button>
                </div>
                
                {template.variables.length > 0 ? (
                  <div className="space-y-3 border rounded-md p-3">
                    {template.variables.map((variable, index) => (
                      <div key={variable.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                        <div>
                          <Label className="text-xs mb-1 block">Variable {`{{${index + 1}}}`}</Label>
                          <Input
                            placeholder="Placeholder description"
                            value={variable.placeholder}
                            onChange={(e) => updateVariable(variable.id, "placeholder", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Example Value</Label>
                          <Input
                            placeholder="Example value"
                            value={variable.example}
                            onChange={(e) => updateVariable(variable.id, "example", e.target.value)}
                          />
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="mt-5"
                          onClick={() => removeVariable(variable.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No variables defined. Add variables to make your template dynamic.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer">Footer</Label>
                <Input 
                  id="footer" 
                  placeholder="Enter template footer" 
                  value={template.footer}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Buttons</Label>
                  <p className="text-xs text-muted-foreground">Max 3 buttons</p>
                </div>
                
                {template.buttons.length > 0 && (
                  <div className="space-y-2 border rounded-md p-3 mb-3">
                    {template.buttons.map((button, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{button.type === "quick_reply" ? "Quick Reply" : 
                            button.type === "url" ? "URL" : "Call"}</span>: {button.text}
                          {(button.type === "url" || button.type === "call") && button.value && (
                            <span className="text-xs text-muted-foreground block">
                              {button.type === "url" ? "URL: " : "Phone: "}{button.value}
                            </span>
                          )}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeButton(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {template.buttons.length < 3 && (
                  <div className="border rounded-md p-3">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="type" className="text-xs">Button Type</Label>
                        <select
                          id="type"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newButton.type}
                          onChange={handleButtonInputChange}
                        >
                          <option value="quick_reply">Quick Reply</option>
                          <option value="url">URL</option>
                          <option value="call">Call</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="text" className="text-xs">Button Text</Label>
                        <Input 
                          id="text" 
                          placeholder="Button text" 
                          value={newButton.text}
                          onChange={handleButtonInputChange}
                        />
                      </div>
                      
                      {(newButton.type === "url" || newButton.type === "call") && (
                        <div>
                          <Label htmlFor="value" className="text-xs">
                            {newButton.type === "url" ? "URL" : "Phone Number"}
                          </Label>
                          <Input 
                            id="value" 
                            type={newButton.type === "url" ? "url" : "tel"}
                            placeholder={newButton.type === "url" ? "https://example.com" : "+1234567890"} 
                            value={newButton.value || ""}
                            onChange={handleButtonInputChange}
                          />
                        </div>
                      )}
                      
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="w-full"
                        onClick={addButton}
                      >
                        Add Button
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={createTemplateMutation.isPending}
              >
                {createTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Save Template"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              <div className="max-w-sm mx-auto">
                {template.header && (
                  <div className="font-semibold mb-2 text-gray-800">
                    {template.header}
                  </div>
                )}
                
                {template.body && (
                  <div className="mb-2 whitespace-pre-line">
                    {replaceVariables(template.body)}
                  </div>
                )}
                
                {template.footer && (
                  <div className="text-sm text-gray-500 mb-3">
                    {template.footer}
                  </div>
                )}
                
                {template.buttons.length > 0 && (
                  <div className="border-t pt-2 flex flex-col gap-2">
                    {template.buttons.map((button, index) => (
                      <div key={index} className="w-full border rounded-full py-1 px-4 text-center whatsapp-text-secondary border-gray-300">
                        {button.type === "call" && "📞 "}
                        {button.type === "url" && "🔗 "}
                        {button.text}
                      </div>
                    ))}
                  </div>
                )}
                
                {!template.header && !template.body && !template.footer && template.buttons.length === 0 && (
                  <div className="text-gray-500 italic text-center">
                    Fill in the template details to see the preview
                  </div>
                )}
                
                {template.variables.length > 0 && template.body && template.body.includes("{{") && (
                  <div className="mt-4 border-t pt-2">
                    <div className="text-xs font-medium text-gray-600 mb-1">Variables in this template:</div>
                    {template.variables.map((variable, index) => (
                      <div key={variable.id} className="text-xs text-gray-500">
                        {`{{${index + 1}}}`}: {variable.placeholder || "No description"} 
                        {variable.example && ` (Example: ${variable.example})`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewTemplate;
