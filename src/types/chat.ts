
export interface Template {
  id: number;
  name: string;
  language: string;
  category: string;
  header_text: string | null;
  body_text: string;
  footer_text: string | null;
  has_buttons: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  meta_template_id?: string; // Added this field back
}

// Message interface for Chat functionality
export interface Message {
  id: number;
  message_type: string;
  content: string;
  direction: "inbound" | "outbound";
  status: "sent" | "delivered" | "read" | "failed" | "received";
  created_at: string;
}

// Conversation interface for Chat functionality
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

// MessageSendResponse interface
export interface MessageSendResponse {
  success: boolean;
  data?: Message;
  error?: string;
}

// WhatsAppSendMessageRequest interface
export interface WhatsAppSendMessageRequest {
  fromPhoneNumber: string;
  recipient: string;
  messageType: "text" | "template" | "image" | "document" | "video";
  messageData: string | object;
}

// Template variable interface
export interface TemplateVariable {
  variable_name: string;
  example_value: string;
  order_index: number;
}

// Template button interface
export interface TemplateButton {
  button_type: "url" | "call" | "quick_reply";
  button_text: string;
  button_value?: string;
  order_index: number;
}

// Dashboard data interface
export interface DashboardData {
  phone_number: string;
  business_name: string;
  connected: boolean;
  [key: string]: any; // For any additional properties
}

// Template response interface
export interface TemplateResponse {
  success: boolean;
  templates: Template[];
  [key: string]: any;
}

// Template create request interface
export interface TemplateCreateRequest {
  name: string;
  language: string;
  category: string;
  header_text?: string | null;
  body_text: string;
  footer_text?: string | null;
  has_buttons?: number;
  phone_number?: string; // Added this field
  variables?: TemplateVariable[];
  buttons?: TemplateButton[];
  [key: string]: any;
}
