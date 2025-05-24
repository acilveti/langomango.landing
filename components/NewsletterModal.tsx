import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useEscClose from 'hooks/useEscKey';
import { media } from 'utils/media';
import Button from './Button';
import CloseIcon from './CloseIcon';
import Container from './Container';
import Input from './Input';
import Overlay from './Overlay';
import * as Yup from 'yup';

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
      // : 'https://api-bk.langomango.com/';
      : 'https://staging.langomango.com/';
  }
  
  // Server-side fallback
  // return 'https://api-bk.langomango.com/';
  return 'https://staging.langomango.com/';
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
    baseURL: 'https://staging.langomango.com/',
    // baseURL: 'https://api-bk.langomango.com/',
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
            window.location.href = 'https://beta-app.langomango.com/login';
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

// Yup validation schema with enhanced password requirements
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[0-9]/, 'Passwords must have at least one digit (\'0\'-\'9\')')
    .matches(/[A-Z]/, 'Passwords must have at least one uppercase (\'A\'-\'Z\')')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

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
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
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

  // Real-time validation function
  const validateField = async (fieldName: string, fieldValue: string, allValues: typeof values) => {

    // Special case for confirmPassword - validate against current password
    if (fieldName === 'confirmPassword' || fieldName === 'password') {
      try {
        await validationSchema.validateAt('confirmPassword', {
          password: fieldName === 'password' ? fieldValue : allValues.password,
          confirmPassword: fieldName === 'confirmPassword' ? fieldValue : allValues.confirmPassword
        });
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setErrors(prev => ({ ...prev, confirmPassword: error.message }));
        }
      }
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    
    // If field has been touched, validate it in real-time
    if (touched[field]) {
      validateField(field, value, newValues);
    }
  };

  const handleBlur = (field: string) => async () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate the field when it loses focus
    await validateField(field, values[field as keyof typeof values], values);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields using Yup
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({}); // Clear all errors if validation passes
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const formErrors: Record<string, string> = {};
        error.inner.forEach(err => {
          if (err.path) {
            formErrors[err.path] = err.message;
          }
        });
        setErrors(formErrors);
        return; // Don't submit if there are validation errors
      }
    }

    setIsLoading(true);

    try {
      // Get referral code if you have that functionality
      // const referralCode = getReferral();
      
      const response = await registerUser({ 
        email: values.email, 
        password: values.password,
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
        setErrors({ submit: 'Registration failed' });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setErrors({ submit: errorMessage });
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
      setErrors({ submit: 'An error occurred during Google sign-up.' });
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
                <InputContainer>
                  <CustomInput
                    type="email"
                    value={values.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    hasError={touched.email && !!errors.email}
                  />
                  {touched.email && errors.email && (
                    <ErrorText>{errors.email}</ErrorText>
                  )}
                </InputContainer>
                
                <InputContainer>
                  <CustomInput
                    type="password"
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                    hasError={touched.password && !!errors.password}
                  />
                  {touched.password && errors.password && (
                    <ErrorText>{errors.password}</ErrorText>
                  )}
                </InputContainer>
                
                <InputContainer>
                  <CustomInput
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                    hasError={touched.confirmPassword && !!errors.confirmPassword}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <ErrorText>{errors.confirmPassword}</ErrorText>
                  )}
                </InputContainer>

                {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

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
                      window.location.href = 'https://beta-app.langomango.com/login';
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

// Animations
const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
`;

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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CustomInput = styled(Input)<{ hasError?: boolean }>`
  width: 100%;
  padding: 1.5rem;
  font-size: 1.6rem;
  border: 2px solid ${props => props.hasError ? 'rgb(var(--errorColor))' : 'rgb(var(--inputBorder, 226, 232, 240))'};
  transition: all 0.2s ease;
  animation: ${props => props.hasError ? shake : 'none'} 0.5s ease;

  &:focus {
    border-color: ${props => props.hasError ? 'rgb(var(--errorColor))' : 'rgb(var(--primary))'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(var(--errorColor), 0.1)' : 'rgba(var(--primary), 0.1)'};
  }
`;

const ErrorText = styled.span`
  color: rgb(var(--errorColor));
  font-size: 1.2rem;
  margin-top: 0.25rem;
  font-weight: 500;
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
  padding: 0.5rem;
  background: rgba(var(--errorColor), 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(var(--errorColor), 0.2);
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