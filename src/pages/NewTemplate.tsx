
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const NewTemplate = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle template submission
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
                <Input id="header" placeholder="Enter template header" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  placeholder="Enter template body"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer">Footer</Label>
                <Input id="footer" placeholder="Enter template footer" />
              </div>

              <div className="space-y-2">
                <Label>Buttons</Label>
                <div className="space-y-2">
                  <Input placeholder="Quick Reply Button Text" />
                  <Input placeholder="Call Button Text" />
                  <Input placeholder="URL Button Text" type="url" />
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
              <div className="font-medium">Preview will appear here</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewTemplate;
