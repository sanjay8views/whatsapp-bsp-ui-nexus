
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send } from "lucide-react";

const Chat = () => {
  return (
    <div className="h-[calc(100vh-2rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-80 p-4 flex flex-col">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search chats" className="pl-8" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Placeholder for chat list */}
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <div className="font-medium">Customer {i + 1}</div>
                <div className="text-sm text-gray-500">Last message preview...</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Chat with Customer</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Messages will go here */}
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-whatsapp-primary text-white rounded-lg p-3 max-w-md">
                Hello! How can I help you today?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg p-3 max-w-md">
                I have a question about your service.
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input placeholder="Type a message..." />
            <Button className="bg-whatsapp-primary hover:bg-whatsapp-secondary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Customer Details Sidebar */}
      <Card className="w-80 p-4">
        <h3 className="font-semibold mb-4">Customer Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p>John Doe</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <p>+1 234 567 8900</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p>john@example.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
