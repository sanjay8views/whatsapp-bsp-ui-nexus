
import { DashboardData, TemplateResponse, TemplateCreateRequest } from "@/types/chat";

const API_BASE_URL = "https://testw-ndlu.onrender.com";

// Helper function to get the auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to create headers with auth token
export const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Fetch dashboard data to get phone number
export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    method: "GET",
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  return await response.json();
};

// Fetch all templates
export const fetchTemplates = async (): Promise<TemplateResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/fetch-templates`, {
    method: "GET",
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch templates: ${response.status}`);
  }

  return await response.json();
};

// Create a new template
export const createTemplate = async (template: TemplateCreateRequest): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/create`, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to create template: ${response.status}`);
  }

  return await response.json();
};

// Handle Facebook callback
export const handleFacebookAuth = async (code: string, redirectUri: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/facebook/callback`, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify({
      code,
      redirectUri
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to authenticate with Facebook: ${response.status}`);
  }

  return await response.json();
};
