
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const NewTemplate = () => {
  const [template, setTemplate] = useState({
    header: "",
    body: "",
    footer: "",
    buttons: {
      quickReply: "",
      call: "",
      url: ""
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, placeholder } = e.target;
    
    if (placeholder?.includes("Quick Reply")) {
      setTemplate(prev => ({
        ...prev,
        buttons: { ...prev.buttons, quickReply: value }
      }));
    } else if (placeholder?.includes("Call")) {
      setTemplate(prev => ({
        ...prev,
        buttons: { ...prev.buttons, call: value }
      }));
    } else if (placeholder?.includes("URL")) {
      setTemplate(prev => ({
        ...prev,
        buttons: { ...prev.buttons, url: value }
      }));
    } else {
      setTemplate(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle template submission
    console.log("Template data:", template);
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
                <Label htmlFor="header">Header</Label>
                <Input 
                  id="header" 
                  placeholder="Enter template header" 
                  value={template.header}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  placeholder="Enter template body"
                  className="min-h-[100px]"
                  value={template.body}
                  onChange={handleChange}
                />
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
                <Label>Buttons</Label>
                <div className="space-y-2">
                  <Input 
                    placeholder="Quick Reply Button Text" 
                    value={template.buttons.quickReply}
                    onChange={handleChange}
                  />
                  <Input 
                    placeholder="Call Button Text" 
                    value={template.buttons.call}
                    onChange={handleChange}
                  />
                  <Input 
                    placeholder="URL Button Text" 
                    type="url" 
                    value={template.buttons.url}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">Create Template</Button>
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
                    {template.body}
                  </div>
                )}
                
                {template.footer && (
                  <div className="text-sm text-gray-500 mb-3">
                    {template.footer}
                  </div>
                )}
                
                {(template.buttons.quickReply || template.buttons.call || template.buttons.url) && (
                  <div className="border-t pt-2 flex flex-col gap-2">
                    {template.buttons.quickReply && (
                      <div className="w-full border rounded-full py-1 px-4 text-center whatsapp-text-secondary border-gray-300">
                        {template.buttons.quickReply}
                      </div>
                    )}
                    
                    {template.buttons.call && (
                      <div className="w-full border rounded-full py-1 px-4 text-center whatsapp-text-secondary border-gray-300">
                        📞 {template.buttons.call}
                      </div>
                    )}
                    
                    {template.buttons.url && (
                      <div className="w-full border rounded-full py-1 px-4 text-center whatsapp-text-secondary border-gray-300">
                        🔗 {template.buttons.url}
                      </div>
                    )}
                  </div>
                )}
                
                {!template.header && !template.body && !template.footer && !template.buttons.quickReply && 
                 !template.buttons.call && !template.buttons.url && (
                  <div className="text-gray-500 italic text-center">
                    Fill in the template details to see the preview
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
