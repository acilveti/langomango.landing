// API configuration
//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging.langomango.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://419ccdd789de.ngrok.app';

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

export interface SignupWithEmailRequest {
  email: string;
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
}

export interface SignupWithEmailResponse {
  success: boolean;
  token: string;
  user: DemoUserInfo;
  redirectUrl: string;
}

export interface UpdateUserProfileRequest {
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  redirectUrl: string;
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

  // Signup with email endpoint (creates user with language preferences)
  async signupWithEmail(data: SignupWithEmailRequest): Promise<SignupWithEmailResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register-withoutpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        referralCode: '' // Add if you have referral functionality
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create account');
    }

    const result = await response.json();
    
    // The response includes a token for auto-login
    return {
      success: true,
      token: result.token,
      user: {
        id: '', // Will be populated by profile update
        username: data.email.split('@')[0],
        email: data.email,
        name: data.email.split('@')[0],
        profile: {
          nativeLanguage: getLanguageDetails(data.nativeLanguage),
          targetLanguage: getLanguageDetails(data.targetLanguage),
          level: data.level
        }
      },
      redirectUrl: 'https://beta-app.langomango.com/reader'
    };
  }

  // Update user profile endpoint for authenticated users
  async updateUserProfile(data: UpdateUserProfileRequest, token: string): Promise<UpdateUserProfileResponse> {
    return this.request<UpdateUserProfileResponse>('/auth/update-demo-profile', {
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

// Helper function to get language details
function getLanguageDetails(code: string): LanguageDetails {
  const languages: Record<string, LanguageDetails> = {
    'de': { code: 'de', name: 'German', flag: '🇩🇪' },
    'es': { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    'fr': { code: 'fr', name: 'French', flag: '🇫🇷' },
    'it': { code: 'it', name: 'Italian', flag: '🇮🇹' },
    'pt': { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    'zh': { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    'ja': { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    'ko': { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    'ru': { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    'en': { code: 'en', name: 'English', flag: '🇬🇧' }
  };

  return languages[code] || { code: code, name: code.toUpperCase(), flag: '🌐' };
}

// Export singleton instance
export const apiService = new ApiService();

// Stripe integration types and functions
export interface CreateCheckoutSessionRequest {
  priceLookupKey: string;
  planType: string;
  includeTrial: boolean;
  returnUrl: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface UserSubscriptionStatus {
  isActive: boolean;
  isTrialing?: boolean;
  hasTrialed?: boolean;
  status: string;
  endDate?: string;
  lastPaymentDate?: string;
  trialEndDate?: string;
}

// Add these methods to the ApiService class
export async function createEnhancedCheckoutSession(
  request: CreateCheckoutSessionRequest,
  token?: string
): Promise<CreateCheckoutSessionResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/stripe/create-checkout-session-enhanced`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create checkout session');
  }

  return response.json();
}

export async function getUserSubscriptionStatus(token: string): Promise<UserSubscriptionStatus> {
  const response = await fetch(`${API_URL}/stripe/subscription-status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription status');
  }

  return response.json();
}
