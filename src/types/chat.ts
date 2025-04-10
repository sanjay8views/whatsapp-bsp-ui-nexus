
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

export interface TemplateVariable {
  variable_name: string;
  example_value: string;
  order_index: number;
}

export interface TemplateButton {
  button_type: "url" | "call" | "quick_reply";
  button_text: string;
  button_value?: string;
  order_index: number;
}

export interface TemplateCreateRequest {
  phone_number: string;
  name: string;
  language: string;
  category: string;
  header_text?: string;
  body_text: string;
  footer_text?: string;
  variables?: TemplateVariable[];
  buttons?: TemplateButton[];
}

export interface Template {
  id: number;
  waba_account_id: number;
  name: string;
  status: string;
  language: string;
  category: string;
  header_text: string | null;
  body_text: string;
  footer_text: string | null;
  has_buttons: number;
  meta_template_id: string;
  created_at: string;
  updated_at: string;
  rejection_reason: string | null;
}

export interface TemplateResponse {
  templates: Template[];
}

export interface DashboardData {
  success: boolean;
  data: {
    phone_number: string;
    business_name: string | null;
    connected: boolean;
    error?: string;
  };
}
