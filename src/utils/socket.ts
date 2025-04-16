import { io, Socket } from "socket.io-client";
import { Message } from "@/types/chat";
import { API_CONFIG } from '@/config/api';

interface WhatsAppMessage {
  id: number;
  message_type: string;
  content: string;
  direction: "inbound" | "outbound";
  status: "sent" | "delivered" | "read" | "failed" | "received";
  created_at: string;
}

interface WhatsAppStatus {
  messageId: number;
  status: "sent" | "delivered" | "read" | "failed";
}

interface SocketHandlers {
  onNewMessage?: (message: WhatsAppMessage) => void;
  onStatusUpdate?: (status: WhatsAppStatus) => void;
  onTemplateUpdate?: (templateData: any) => void;
  onCustomEvent?: (data: any) => void;
}

// Singleton socket instance
let socket: Socket | null = null;

export const initializeSocket = (handlers: SocketHandlers) => {
  // Only create a new socket if one doesn't exist
  if (socket && socket.connected) {
    console.log("Reusing existing socket connection:", socket.id);
    
    // Re-register event handlers on the existing socket
    registerSocketEventHandlers(socket, handlers);
    
    return socket;
  }
  
  if (socket && !socket.connected) {
    console.log("Socket exists but disconnected. Reconnecting...");
    socket.connect();
    registerSocketEventHandlers(socket, handlers);
    return socket;
  }

  console.log("Initializing new socket connection...");
  
  // Create a new socket connection with connection parameters
  socket = io(API_CONFIG.BASE_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  registerSocketEventHandlers(socket, handlers);
  
  return socket;
};

// Helper function to register all event handlers
const registerSocketEventHandlers = (socket: Socket, handlers: SocketHandlers) => {
  // Remove all existing listeners to prevent duplicates
  socket.removeAllListeners();
  
  // Connect event
  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server with ID:", socket.id);
  });

  // Handle standard WhatsApp message event
  socket.on("whatsapp_message", (message: WhatsAppMessage) => {
    console.log("📥 New WhatsApp Message received:", message);
    if (handlers.onNewMessage) {
      handlers.onNewMessage(message);
    }
  });

  // Handle the additional 'new_message' event
  socket.on("new_message", (data) => {
    console.log("📩 New message event received:", data);
    if (handlers.onCustomEvent) {
      handlers.onCustomEvent(data);
    } else if (handlers.onNewMessage) {
      handlers.onNewMessage(data);
    }
  });

  socket.on("whatsapp_status", (status: WhatsAppStatus) => {
    console.log("📤 Message Status Update:", status);
    if (handlers.onStatusUpdate) {
      handlers.onStatusUpdate(status);
    }
  });

  socket.on("template_update", (templateData) => {
    console.log("📄 Template Status Update:", templateData);
    if (handlers.onTemplateUpdate) {
      handlers.onTemplateUpdate(templateData);
    }
  });

  // Error handling events
  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from WebSocket server. Reason:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Reconnection events
  socket.io.on("reconnect", (attempt) => {
    console.log(`🔄 Socket reconnected after ${attempt} attempts`);
  });

  socket.io.on("reconnect_attempt", (attempt) => {
    console.log(`🔄 Socket reconnection attempt #${attempt}`);
  });

  socket.io.on("reconnect_error", (error) => {
    console.error("Socket reconnection error:", error);
  });

  socket.io.on("reconnect_failed", () => {
    console.error("Socket reconnection failed after all attempts");
  });
};

export const getSocket = () => {
  return socket;
};

export const joinRoom = (wabaAccountId: number | string) => {
  if (socket && socket.connected) {
    console.log(`Joining room for WABA account ID: ${wabaAccountId}`);
    socket.emit("join_room", wabaAccountId);
    return true;
  } else {
    console.error("Cannot join room: Socket not connected");
    return false;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting socket:", socket.id);
    socket.disconnect();
    socket = null;
  } else {
    console.log("No socket to disconnect");
  }
};
