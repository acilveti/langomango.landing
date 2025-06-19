// API configuration
//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging.langomango.com';
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

export interface DemoSignupEmailRequest {
  email: string;
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
}

export interface DemoSignupEmailResponse {
  success: boolean;
  token: string;
  user: DemoUserInfo;
  redirectUrl: string;
}

export interface RegisterWithGoogleRequest {
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
  referralCode?: string;
}

export interface UpdateDemoProfileRequest {
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
}

export interface UpdateDemoProfileResponse {
  success: boolean;
  redirectUrl: string;
  message: string;
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
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

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

  // Demo signup with email endpoint
  async demoSignupWithEmail(data: DemoSignupEmailRequest): Promise<DemoSignupEmailResponse> {
    return this.request<DemoSignupEmailResponse>('/auth/demo-signup-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update demo profile endpoint for authenticated users
  async updateDemoProfile(data: UpdateDemoProfileRequest, token: string): Promise<UpdateDemoProfileResponse> {
    return this.request<UpdateDemoProfileResponse>('/auth/update-demo-profile', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Helper to get the Google login URL with language preferences
  getGoogleLoginUrl(params: RegisterWithGoogleRequest): string {
    const queryParams = new URLSearchParams({
      returnUrl: '/sign-up',
      frontendRedirectUrl: 'https://beta-app.langomango.com/',
      ...(params.referralCode && { referralCode: params.referralCode })
    });
    
    // Store language preferences in session storage for after redirect
    if (params.nativeLanguage || params.targetLanguage || params.level) {
      sessionStorage.setItem('languagePreferences', JSON.stringify({
        nativeLanguage: params.nativeLanguage,
        targetLanguage: params.targetLanguage,
        level: params.level
      }));
    }
    
    return `${this.baseUrl}/auth/login-google?${queryParams.toString()}`;
  }
}

// Export singleton instance
export const apiService = new ApiService();
