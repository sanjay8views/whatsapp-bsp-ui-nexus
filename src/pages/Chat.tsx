
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Check, CheckCheck, Phone, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Conversation, Message } from "@/types/chat";
import { initializeSocket, disconnectSocket } from "@/utils/socket";
import { format } from "date-fns";

// Function to fetch conversations
const fetchConversations = async (): Promise<Conversation[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch("https://testw-ndlu.onrender.com/api/conversations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.status}`);
  }

  return response.json();
};

// Function to send a message
const sendMessage = async ({ conversationId, content }: { conversationId: number; content: string }): Promise<Message> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`https://testw-ndlu.onrender.com/api/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, message_type: "text" }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}`);
  }

  return response.json();
};

// Component to render message status indicators
const MessageStatus = ({ status }: { status: Message["status"] }) => {
  if (status === "sent") {
    return <Check className="h-3 w-3 text-gray-400" />;
  } else if (status === "delivered") {
    return <CheckCheck className="h-3 w-3 text-gray-400" />;
  } else if (status === "read") {
    return <CheckCheck className="h-3 w-3 text-blue-500" />;
  } else if (status === "failed") {
    return <span className="text-xs text-red-500">Failed</span>;
  }
  return null;
};

const Chat = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [messageInput, setMessageInput] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Fetch conversations data
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // Refetch conversations to update with the new message
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  // Set up socket connection for real-time updates
  useEffect(() => {
    const socket = initializeSocket({
      onNewMessage: (message) => {
        console.log("Received new message:", message);
        // Refetch conversation data when a new message comes in
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
      onStatusUpdate: (status) => {
        console.log("Message status updated:", status);
        // Refetch conversation data when a message status changes
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });

    // Clean up socket on unmount
    return () => {
      disconnectSocket();
    };
  }, [queryClient]);

  // Auto-select the first conversation when data loads
  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation.id,
      content: messageInput,
    });
    
    setMessageInput("");
  };

  // Handle pressing Enter key in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    // Format starts with country code
    if (phone.startsWith("91")) {
      return `+${phone.substring(0, 2)} ${phone.substring(2)}`;
    }
    return phone;
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-whatsapp-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
        <Card className="p-6 text-center">
          <h3 className="text-xl font-semibold text-red-600">Error</h3>
          <p className="text-gray-600 mt-2">{error instanceof Error ? error.message : "Failed to load conversations"}</p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["conversations"] })}
            className="mt-4"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

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
            {conversations && conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className={`p-3 hover:bg-gray-100 rounded-lg cursor-pointer ${
                    selectedConversation?.id === conversation.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="font-medium">
                    {conversation.customer_name || formatPhoneNumber(conversation.customer_phone)}
                  </div>
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span className="truncate max-w-[120px]">{conversation.last_message}</span>
                    <span className="text-xs">
                      {format(new Date(conversation.last_message_time), "HH:mm")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No conversations found</div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            {selectedConversation
              ? selectedConversation.customer_name || formatPhoneNumber(selectedConversation.customer_phone)
              : "Select a conversation"}
          </h2>
        </div>
        
        {/* Messages container with ScrollArea for better scrolling */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedConversation?.messages?.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-md ${
                    message.direction === 'outbound' 
                      ? 'bg-whatsapp-primary text-white' 
                      : 'bg-white border'
                  }`}
                >
                  {message.content}
                  <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                    message.direction === 'outbound' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {format(new Date(message.created_at), "HH:mm")}
                    {message.direction === 'outbound' && <MessageStatus status={message.status} />}
                  </div>
                </div>
              </div>
            ))}
            {!selectedConversation && (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Message input area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input 
              placeholder={selectedConversation ? "Type a message..." : "Select a conversation first"} 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!selectedConversation || sendMessageMutation.isPending}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-whatsapp-primary hover:bg-whatsapp-secondary"
              disabled={!selectedConversation || !messageInput.trim() || sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Customer Details Sidebar */}
      <Card className="w-80 p-4">
        <h3 className="font-semibold mb-4">Customer Details</h3>
        {selectedConversation ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-3 bg-gray-100 rounded-full">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">
                  {selectedConversation.customer_name || "Unknown Name"}
                </p>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone
              </label>
              <p className="mt-1">{formatPhoneNumber(selectedConversation.customer_phone)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Conversation Started</label>
              <p className="mt-1">{format(new Date(selectedConversation.created_at), "PPP")}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Activity</label>
              <p className="mt-1">{format(new Date(selectedConversation.updated_at), "PPP 'at' h:mm a")}</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            Select a conversation to view customer details
          </div>
        )}
      </Card>
    </div>
  );
};

export default Chat;
