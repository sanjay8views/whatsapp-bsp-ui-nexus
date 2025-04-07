
export interface Message {
  id: number;
  message_type: string;
  content: string;
  direction: "inbound" | "outbound";
  status: "sent" | "delivered" | "read" | "failed" | "received";
  created_at: string;
}

export interface Conversation {
  id: number;
  waba_account_id: number;
  customer_phone: string;
  customer_name: string | null;
  last_message: string;
  last_message_time: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface MessageSendResponse {
  success: boolean;
  data?: Message;
  error?: string;
}

export interface WhatsAppSendMessageRequest {
  fromPhoneNumber: string;
  recipient: string;
  messageType: "text" | "template" | "image" | "document" | "video";
  messageData: string | object;
}
