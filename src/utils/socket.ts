
import { io, Socket } from "socket.io-client";

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
  onCustomEvent?: (data: any) => void; // Generic handler for additional events
}

let socket: Socket | null = null;

export const initializeSocket = (handlers: SocketHandlers) => {
  if (socket) {
    console.log("Socket already initialized:", socket.id);
    return socket;
  }

  console.log("Initializing new socket connection...");
  socket = io("https://testw-ndlu.onrender.com");

  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server with ID:", socket.id);
  });

  // Handle standard WhatsApp message event
  socket.on("whatsapp_message", (message) => {
    console.log("📥 Standard WhatsApp Message received:", message);
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
      // Fall back to standard message handler if custom handler not provided
      handlers.onNewMessage(data);
    }
  });

  socket.on("whatsapp_status", (status) => {
    console.log("📤 Message Status Update:", status);
    if (handlers.onStatusUpdate) {
      handlers.onStatusUpdate(status);
    }
  });

  socket.on("template_update", (templateData) => {
    console.log("📄 Template Status Update:", templateData);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected from WebSocket server. Reason:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

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

  return socket;
};

export const getSocket = () => {
  return socket;
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
