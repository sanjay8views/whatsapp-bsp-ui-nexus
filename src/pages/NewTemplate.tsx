
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface TemplateVariable {
  id: string;
  placeholder: string;
  example: string;
}

interface TemplateButton {
  type: "quickReply" | "url" | "call";
  text: string;
  value?: string;
}

const NewTemplate = () => {
  const [template, setTemplate] = useState({
    name: "",
    language: "en_US",
    category: "MARKETING",
    header: "",
    body: "",
    footer: "",
    variables: [] as TemplateVariable[],
    buttons: [] as TemplateButton[]
  });

  const [newButton, setNewButton] = useState<TemplateButton>({
    type: "quickReply",
    text: "",
    value: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setTemplate(prev => ({ ...prev, [id]: value }));
  };

  const addVariable = () => {
    const newVariable: TemplateVariable = {
      id: Date.now().toString(),
      placeholder: "",
      example: ""
    };
    setTemplate(prev => ({
      ...prev,
      variables: [...prev.variables, newVariable]
    }));
  };

  const updateVariable = (id: string, field: keyof TemplateVariable, value: string) => {
    setTemplate(prev => ({
      ...prev,
      variables: prev.variables.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    }));
  };

  const removeVariable = (id: string) => {
    setTemplate(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v.id !== id)
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
      setNewButton({ type: "quickReply", text: "", value: "" });
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
    // Format template for Meta API
    const formattedTemplate = {
      name: template.name,
      language: template.language,
      category: template.category,
      components: [
        ...(template.header ? [{ type: "HEADER", text: template.header }] : []),
        { type: "BODY", text: template.body },
        ...(template.footer ? [{ type: "FOOTER", text: template.footer }] : []),
        ...(template.buttons.length > 0 ? [{
          type: "BUTTONS",
          buttons: template.buttons.map(button => {
            if (button.type === "quickReply") {
              return { type: "QUICK_REPLY", text: button.text };
            } else if (button.type === "url") {
              return { type: "URL", text: button.text, url: button.value };
            } else {
              return { type: "PHONE_NUMBER", text: button.text, phone_number: button.value };
            }
          })
        }] : [])
      ]
    };
    console.log("Template data:", formattedTemplate);
  };

  // Helper function to replace variables in preview
  const replaceVariables = (text: string) => {
    if (!text) return "";
    
    let result = text;
    template.variables.forEach((variable, index) => {
      const placeholder = `{{${index + 1}}}`;
      const replacement = variable.example ? variable.example : placeholder;
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
                    <option value="en_US">English (US)</option>
                    <option value="es_LA">Spanish (LATAM)</option>
                    <option value="pt_BR">Portuguese (Brazil)</option>
                    <option value="fr_FR">French</option>
                    <option value="de_DE">German</option>
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
                    <option value="AUTHENTICATION">Authentication</option>
                    <option value="UTILITY">Utility</option>
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
                          <span className="font-medium">{button.type === "quickReply" ? "Quick Reply" : 
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
                          <option value="quickReply">Quick Reply</option>
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

              <Button type="submit" className="w-full">Save Template</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              {/* WhatsApp-style template preview */}
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
