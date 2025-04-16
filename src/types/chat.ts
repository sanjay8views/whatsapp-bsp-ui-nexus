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
  [key: string]: any;
}
