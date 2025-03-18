
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'customer';
  timestamp: Date;
}

const Chat = () => {
  // State for message input and messages list
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "user",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      text: "I have a question about your service.",
      sender: "customer",
      timestamp: new Date(),
    },
  ]);

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput,
        sender: "user", // Current user is always the sender in this context
        timestamp: new Date(),
      };
      
      setMessages([...messages, newMessage]);
      setMessageInput("");
      
      // Simulate receiving a response after 1 second
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message. I'll get back to you soon.",
          sender: "customer",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  };

  // Handle pressing Enter key in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className="font-medium">Customer {i + 1}</div>
                <div className="text-sm text-gray-500">Last message preview...</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Chat with Customer</h2>
        </div>
        
        {/* Messages container with ScrollArea for better scrolling */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-md ${
                    message.sender === 'user' 
                      ? 'bg-whatsapp-primary text-white' 
                      : 'bg-white border'
                  }`}
                >
                  {message.text}
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Message input area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input 
              placeholder="Type a message..." 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-whatsapp-primary hover:bg-whatsapp-secondary"
            >
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
