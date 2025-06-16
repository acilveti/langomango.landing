// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Type definitions
export interface DemoSignupRequest {
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
}

export interface LanguageDetails {
  code: string;
  name: string;
  flag: string;
}

export interface DemoUserProfile {
  nativeLanguage: LanguageDetails;
  targetLanguage: LanguageDetails;
  level: string;
}

export interface DemoUserInfo {
  id: string;
  username: string;
  email: string;
  name: string;
  profile: DemoUserProfile;
}

export interface DemoSignupResponse {
  success: boolean;
  user: DemoUserInfo;
  redirectUrl: string;
}

export interface ApiError {
  error: string;
  success: false;
}

// API service class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If parsing fails, use default error message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Demo signup endpoint
  async demoSignup(data: DemoSignupRequest): Promise<DemoSignupResponse> {
    return this.request<DemoSignupResponse>('/auth/demo-signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
