import React, { useState } from 'react';
import styled from 'styled-components';
import useEscClose from 'hooks/useEscKey';
import { media } from 'utils/media';
import Button from './Button';
import CloseIcon from './CloseIcon';
import Container from './Container';
import Input from './Input';
import Overlay from './Overlay';

// Axios imports
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// API Types and Interfaces
interface ApiError {
  response?: {
    status: number
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }
}

interface ISignUpJson {
  email: string;
  password: string;
  referralCode?: string;
}

// Environment and URL Configuration
type Environment = 'development' | 'staging' | 'production';

const getBaseURL = () => {
  // For Next.js/Web
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    
    return process.env.NODE_ENV === 'development'
      ? process.env.NGROK || 'http://192.168.0.14:8080/'
      : 'https://api-bk.langomango.com/';
  }
  
  // Server-side fallback
  return 'https://api-bk.langomango.com/';
};

const API_CONFIG = {
  development: {
    baseURL: getBaseURL(),
    timeout: 120000,
  },
  staging: {
    baseURL: 'https://staging.langomango.com/',
    timeout: 120000,
  },
  production: {
    baseURL: 'https://api-bk.langomango.com/',
    timeout: 120000,
  },
};

const getEnvironment = (): Environment => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENV) {
    if (process.env.NEXT_PUBLIC_ENV === 'development') return 'development';
    if (process.env.NEXT_PUBLIC_ENV === 'staging') return 'staging';
    if (process.env.NEXT_PUBLIC_ENV === 'production') return 'production';
  }
  
  return process.env.NODE_ENV === 'development' ? 'development' : 'production';
};

const getBaseUrlConfig = () => {
  const environment = getEnvironment();
  return API_CONFIG[environment];
};

// Auth Service (simplified for modal)
class SimpleAuthService {
  static async getToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    // Try localStorage first
    const token = localStorage.getItem('auth_token');
    if (token) return token;
    
    // Add any other token storage methods you use
    return null;
  }

  static async setToken(token: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  static async clearAuth(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }
}

// API Client
class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    const config = getBaseUrlConfig();

    this.api = axios.create({
      ...config,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = await SimpleAuthService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await SimpleAuthService.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(new Error('Authentication required'));
        }
        return Promise.reject(error);
      },
    );
  }

  public async post<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }
}

// Create API client instance
const apiClient = ApiClient.getInstance();

// Utility functions
function isApiError(error: unknown): error is ApiError {
  const maybeError = error as Record<string, unknown>;
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    'response' in maybeError &&
    Boolean(maybeError.response) &&
    typeof maybeError.response === 'object' &&
    'status' in (maybeError.response as Record<string, unknown>) &&
    typeof (maybeError.response as Record<string, unknown>).status === 'number'
  );
}

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// API functions
async function registerUser(values: ISignUpJson) {
  try {
    return await apiClient.post('/auth/register', {
      email: values.email,
      password: values.password,
      confirmPassword: values.password,
      referralCode: values.referralCode || "", // Always send a string, empty if no referral
    });
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

// Google Auth interfaces
interface IGoogleAuthResponse {
  redirectUrl: string;
}

interface IGoogleAuthRequest {
  referralCode?: string;
}

// Google Auth functions
function handleGoogleAuthCallback(): boolean {
  try {
    // Check if token is in URL hash (fragment)
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('token=')) {
      console.log('JWT token found in URL hash');
      
      // Extract token from hash fragment
      const tokenMatch = window.location.hash.match(/token=([^&]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const token = decodeURIComponent(tokenMatch[1]);
        console.log('Token extracted successfully');
        
        // Store the JWT token synchronously to avoid race conditions
        try {
          // Store in localStorage for immediate access
          localStorage.setItem('auth_token', token);
          console.log('Token stored in localStorage');
          
          // Also store using AuthService for consistency
          SimpleAuthService.setToken(token).catch(err => {
            console.error('Error in AuthService.setToken', err);
            // Token is already in localStorage, so we can continue
          });
          
          // Clean up the URL by removing the hash fragment
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          
          return true;
        } catch (storageError) {
          console.error('Error storing token:', storageError);
          return false;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error handling Google auth JWT callback:', error);
    return false;
  }
}

async function initiateGoogleAuth(referralCode?: string, returnUrl: string = "/thank-you"): Promise<void> {
  console.log("initiateGoogleAuth");
  try {
    // Get the base URL
    let baseUrl = getBaseUrlConfig().baseURL;
    
    // Replace IP address with localhost if in development environment
    if (baseUrl.includes('192.168.') || baseUrl.includes('10.0.') || baseUrl.includes('172.16.')) {
      // Extract the port number from the baseUrl
      const portMatch = baseUrl.match(/:(\d+)/);
      const port = portMatch ? portMatch[1] : '8080';
      baseUrl = `http://localhost:${port}/`;
    }
    
    // Get the current frontend URL (this will work correctly regardless of where it's hosted)
    const frontendUrl = "https://beta-app.langomango.com/";
    
    // Construct URL with query parameters to match backend controller
    let authUrl = `${baseUrl}auth/login-google?returnUrl=${encodeURIComponent(returnUrl)}&frontendRedirectUrl=${encodeURIComponent(frontendUrl)}`;
    
    // Add referral code if provided
    if (referralCode) {
      authUrl += `&referralCode=${encodeURIComponent(referralCode)}`;
    }
    
    console.log('Redirecting to Google auth URL:', authUrl);
    console.log('Frontend URL being passed:', frontendUrl);
    
    // Redirect directly to the login-google endpoint on the API server
    window.location.href = authUrl;
  } catch (error) {
    console.error('Error initiating Google authentication:', error);
    throw error;
  }
}

// Referral utilities (optional - uncomment if you want referral support)
/*
function captureReferral() {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('ref');
  
  if (referralCode) {
    localStorage.setItem('referralCode', referralCode);
  }
}

function getReferral(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('referralCode');
}
*/

export interface RegistrationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegistrationModal({ onClose, onSuccess }: RegistrationModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEscClose({ onClose });

  // Check for Google auth callback on component mount
  React.useEffect(() => {
    // Capture referral when component mounts and check for Google auth callback
    // captureReferral(); // Uncomment if using referrals
    
    // Check if this is a return from Google authentication
    if (handleGoogleAuthCallback()) {
      // If we got a token, show success and redirect to beta-app login
      setIsSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        onClose();
        window.location.href = 'https://beta-app.langomango.com/login';
      }, 2000);
    }
  }, [onSuccess, onClose]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Get referral code if you have that functionality
      // const referralCode = getReferral();
      
      const response = await registerUser({ 
        email, 
        password,
        referralCode: "" // Always send empty string since backend requires it
      });

      if (response.status === 200) {
        setIsSuccess(true);
        onSuccess?.();
        // Auto-redirect to beta-app login after 2 seconds
        setTimeout(() => {
          onClose();
          window.location.href = 'https://beta-app.langomango.com/login';
        }, 2000);
      } else {
        setError('Registration failed');
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google Sign Up
  const handleGoogleSignUp = React.useCallback(async () => {
    try {
      // Get referral code if you have that functionality
      // const referralCode = getReferral();
      
      // Directly redirect to Google login with referral code (empty string since backend requires it)
      await initiateGoogleAuth("", "/sign-up"); // Pass empty string for referralCode
      
      // No need for further redirect handling here as the browser will navigate
    } catch (error) {
      console.error('Error during Google sign-up:', error);
      setError('An error occurred during Google sign-up.');
    }
  }, []);

  return (
    <Overlay>
      <Container>
        <Card onSubmit={onSubmit}>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>

          {isSuccess ? (
            <SuccessContainer>
              <Title>Welcome aboard! 🎉</Title>
              <SuccessMessage>Your account has been created successfully!</SuccessMessage>
              <SuccessMessage>Redirecting you to login...</SuccessMessage>
            </SuccessContainer>
          ) : (
            <>
              <Title>Create your account</Title>
              <SubTitle>Join us to leverage your reading hobby</SubTitle>
              
              <FormContainer>
                <CustomInput
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                
                <CustomInput
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
                
                <CustomInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <CustomButton 
                  as="button" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </CustomButton>

                {/* Google Sign Up Section */}
                <DividerContainer>
                  <DividerLine />
                  <DividerText>or</DividerText>
                  <DividerLine />
                </DividerContainer>
                
                <GoogleButton 
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                >
                  <GoogleIconContainer>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </GoogleIconContainer>
                  Sign up with Google
                </GoogleButton>

                {/* Login Section */}
                <LoginSection>
                  <LoginText>Already have an account?</LoginText>
                  <LoginButton 
                    type="button"
                    onClick={() => {
                      onClose();
                      // Navigate to login page
                      window.location.href = '/login';
                    }}
                  >
                    Log in
                  </LoginButton>
                </LoginSection>
              </FormContainer>
            </>
          )}
        </Card>
      </Container>
    </Overlay>
  );
}

const Card = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  margin: auto;
  padding: 5rem 4rem;
  background: rgb(var(--modalBackground));
  border-radius: 0.6rem;
  max-width: 50rem;
  overflow: hidden;
  color: rgb(var(--text));

  ${media('<=tablet')} {
    padding: 4rem 2.5rem;
    max-width: 90vw;
  }
`;

const CloseIconContainer = styled.div`
  position: absolute;
  right: 2rem;
  top: 2rem;

  svg {
    cursor: pointer;
    width: 2rem;
  }
`;

const Title = styled.div`
  font-size: 2.8rem;
  font-weight: bold;
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-align: center;
  color: rgb(var(--text));
  margin-bottom: 1rem;

  ${media('<=tablet')} {
    font-size: 2.2rem;
  }
`;

const SubTitle = styled.div`
  font-size: 1.6rem;
  text-align: center;
  color: rgb(var(--textSecondary));
  margin-bottom: 3rem;

  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const CustomInput = styled(Input)`
  width: 100%;
  padding: 1.5rem;
  font-size: 1.6rem;
`;

const CustomButton = styled(Button)`
  width: 100%;
  padding: 1.8rem;
  margin-top: 1rem;
  font-size: 1.6rem;
  font-weight: 600;
  background: rgb(var(--primary));
  color: white;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: rgb(var(--primaryDark, --primary));
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: rgb(var(--errorColor));
  font-size: 1.4rem;
  text-align: center;
  margin: 0;
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const SuccessMessage = styled.p`
  color: rgb(var(--primary));
  font-size: 1.6rem;
  margin-top: 1rem;
`;

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: rgb(var(--textSecondary));
  opacity: 0.3;
`;

const DividerText = styled.span`
  margin: 0 1.5rem;
  color: rgb(var(--textSecondary));
  font-size: 1.4rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.8rem;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 0.6rem;
  font-size: 1.6rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const GoogleIconContainer = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
`;

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
`;

const LoginText = styled.p`
  color: rgb(var(--textSecondary));
  font-size: 1.4rem;
  margin: 0;
`;

const LoginButton = styled.button`
  background: transparent;
  border: 2px solid rgb(var(--primary));
  color: rgb(var(--primary));
  padding: 1.2rem 2.4rem;
  border-radius: 0.6rem;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover {
    background: rgb(var(--primary));
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;