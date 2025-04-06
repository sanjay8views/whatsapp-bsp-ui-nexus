
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
}

let socket: Socket | null = null;

export const initializeSocket = (handlers: SocketHandlers) => {
  if (socket) return socket;

  socket = io("https://testw-ndlu.onrender.com");

  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server");
  });

  socket.on("whatsapp_message", (message) => {
    console.log("📥 New WhatsApp Message:", message);
    if (handlers.onNewMessage) {
      handlers.onNewMessage(message);
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

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket server");
  });

  socket.on("error", (error) => {
    console.error("Socket Error:", error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
