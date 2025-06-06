import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import useEscClose from 'hooks/useEscKey';
import { media } from 'utils/media';
import { RedditEventTypes, trackRedditConversion } from 'utils/redditPixel';
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
  referralCode?: string;
}

// Request DTO to match backend
interface RegisterWithoutPassDTO {
  Email: string;
  ReferralCode?: string;
}

// Response type for registration
interface RegisterResponse {
  token: string;  // lowercase to match actual response
  message: string; // lowercase to match actual response
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
      : 'https://staging.langomango.com/';
  }
  
  // Server-side fallback
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
    
    const token = localStorage.getItem('auth_token');
    if (token) return token;
    
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

// API functions
async function registerUser(values: ISignUpJson) {
  try {
    const requestData: RegisterWithoutPassDTO = {
      Email: values.email,
      ReferralCode: values.referralCode || "", // Always send a string, empty if no referral
    };

    return await apiClient.post<RegisterResponse, RegisterWithoutPassDTO>(
      '/auth/register-withoutpass', 
      requestData
    );
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
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

async function initiateGoogleAuth(referralCode?: string, returnUrl: string = "/sign-up"): Promise<void> {
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
    
    // Get the current frontend URL
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

// Language interface (matching the one from FeaturesGallery)
interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageRegistrationModalProps {
  selectedLanguage: Language;
  onClose: () => void;
  onSuccess?: () => void;
}

// Simplified Yup validation schema - only email now
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

export default function LanguageRegistrationModal({ 
  selectedLanguage, 
  onClose, 
  onSuccess 
}: LanguageRegistrationModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  useEscClose({ onClose });

  // Check for Google auth callback on component mount
  React.useEffect(() => {
    // Check if this is a return from Google authentication
    if (handleGoogleAuthCallback()) {
      // If we got a token, show success and redirect to beta-app login with token
      setIsSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        onClose();
        const token = localStorage.getItem('auth_token');
        window.location.href = `https://beta-app.langomango.com/login?token=${encodeURIComponent(token || '')}&type=google`;
      }, 2000);
    }
  }, [onSuccess, onClose]);

  // Handle form submission
  const handleSubmit = async (
    values: { email: string },
    { setSubmitting }: FormikHelpers<{ email: string }>
  ) => {
    try {
      setApiError('');
      
      const response = await registerUser({ 
        email: values.email,
        referralCode: "" // Always send empty string since backend requires it
      });

      console.log('Registration response:', response.data); // Debug log

      if (response.status === 200 && response.data?.token) {
        // Track Reddit Pixel SignUp event for email registration
        trackRedditConversion(RedditEventTypes.SIGNUP, {
          signup_method: 'email',
          language: selectedLanguage.code,
          language_name: selectedLanguage.name
        });
        
        // Store the token for backup
        await SimpleAuthService.setToken(response.data.token);
        console.log('Token stored, redirecting to login with token'); // Debug log
        
        setIsSuccess(true);
        onSuccess?.();
        
        // Auto-redirect to login with token in URL after 2 seconds
        setTimeout(() => {
          onClose();
          window.location.href = `https://beta-app.langomango.com/login?token=${encodeURIComponent(response.data.token)}&type=email`;
        }, 2000);
      } else {
        console.error('Registration failed - no token in response:', response.data); // Debug log
        setApiError('Registration failed - no authentication token received');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error); // Debug log
      const errorMessage = getErrorMessage(error);
      setApiError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = React.useCallback(async () => {
    try {
      setApiError('');
      
      // Track Reddit Pixel SignUp event for Google registration
      trackRedditConversion(RedditEventTypes.SIGNUP, {
        signup_method: 'google',
        language: selectedLanguage.code,
        language_name: selectedLanguage.name
      });
      
      // Directly redirect to Google login with referral code (empty string since backend requires it)
      await initiateGoogleAuth("", "/sign-up"); // Pass empty string for referralCode
      
      // No need for further redirect handling here as the browser will navigate
    } catch (error) {
      console.error('Error during Google sign-up:', error);
      setApiError('An error occurred during Google sign-up.');
    }
  }, [selectedLanguage]);

  const handleSkip = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Overlay>
      <Container>
        <Card>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>

          {isSuccess ? (
            <SuccessContainer>
              <Title>Welcome aboard! 🎉</Title>
              <LanguageConfirmation>
                <LanguageFlag>{selectedLanguage.flag}</LanguageFlag>
                <LanguageName>{selectedLanguage.name}</LanguageName>
                <ConfirmationMark>✓</ConfirmationMark>
              </LanguageConfirmation>
              <SuccessMessage>Your account has been created successfully!</SuccessMessage>
              <SuccessMessage>
                You are all set to start learning <strong>{selectedLanguage.name}</strong>!
              </SuccessMessage>
              <SuccessMessage>Redirecting you to set up your password...</SuccessMessage>
            </SuccessContainer>
          ) : (
            <>
              <SubTitle>Ready to learn {selectedLanguage.name}?</SubTitle>
              
              <Title>
                Give it a try using our free demo in {selectedLanguage.name}
              </Title>
              <LanguageDisplayContainer>
                <LanguageDisplay>
                  <LanguageFlag>{selectedLanguage.flag}</LanguageFlag>
                  <LanguageName>{selectedLanguage.name}</LanguageName>
                  <AvailableBadge>
                    <ConfirmationMark>✓</ConfirmationMark>
                    <BadgeText>Available</BadgeText>
                  </AvailableBadge>
                </LanguageDisplay>
              </LanguageDisplayContainer>

              <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                  <FormContainer as="form" onSubmit={handleSubmit}>
                    <InputContainer>
                      <CustomInput
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        disabled={isSubmitting}
                        hasError={touched.email && !!errors.email}
                      />
                      {touched.email && errors.email && (
                        <ErrorText>{errors.email}</ErrorText>
                      )}
                    </InputContainer>

                    {apiError && <ErrorMessage>{apiError}</ErrorMessage>}

                    <CustomButton 
                      as="button" 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account...' : 'Create account'}
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
                      disabled={isSubmitting}
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

                    {/* Skip Section */}
                    <SkipSection>
                      <SkipButton 
                        type="button"
                        onClick={handleSkip}
                        disabled={isSubmitting}
                      >
                        Skip for now
                      </SkipButton>
                    </SkipSection>
                  </FormContainer>
                )}
              </Formik>
            </>
          )}
        </Card>
      </Container>
    </Overlay>
  );
}

// Animations
const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const checkmarkBounce = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

// Styled Components
const Card = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  margin: auto;
  padding: 3rem 3rem;
  background: rgb(var(--modalBackground));
  border-radius: 0.6rem;
  max-width: 45rem;
  max-height: 90vh;
  overflow-y: auto;
  color: rgb(var(--text));

  ${media('<=tablet')} {
    padding: 2.5rem 2rem;
    max-width: 90vw;
    max-height: 90vh;
    margin-top: 10rem;
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
  font-size: 2.2rem;
  font-weight: bold;
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-align: center;
  color: rgb(var(--text));
  margin-bottom: 1.5rem;

  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const LanguageDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const LanguageDisplay = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%);
  border: 2px solid rgba(255, 152, 0, 0.2);
  border-radius: 0.8rem;
  animation: ${bounceIn} 0.6s ease-out;
  gap: 0.8rem;
`;

const LanguageFlag = styled.span`
  font-size: 1.8rem;
  line-height: 1;
`;

const LanguageName = styled.span`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgb(var(--text));

  ${media('<=tablet')} {
    font-size: 1.5rem;
  }
`;

const AvailableBadge = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 1.5rem;
  padding: 0.3rem 0.8rem;
  gap: 0.4rem;
  animation: ${pulse} 2s infinite;
`;

const ConfirmationMark = styled.span`
  color: #22c55e;
  font-size: 1.1rem;
  font-weight: bold;
  animation: ${checkmarkBounce} 0.5s ease-out 0.3s both;
`;

const BadgeText = styled.span`
  color: #059669;
  font-size: 1rem;
  font-weight: 600;
`;

const SubTitle = styled.div`
  font-size: 1.4rem;
  text-align: center;
  color: rgb(var(--textSecondary));
  margin-bottom: 2rem;
  line-height: 1.3;

  ${media('<=tablet')} {
    font-size: 1.3rem;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CustomInput = styled(Input)<{ hasError?: boolean }>`
  width: 100%;
  padding: 1.2rem;
  font-size: 1.4rem;
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
  padding: 1.4rem;
  font-size: 1.5rem;
  font-weight: 600;
  background: rgb(var(--primary));
  color: white;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;

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

const GoogleIconContainer = styled.div`
  margin-right: 0.8rem;
  display: flex;
  align-items: center;
`;

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  gap: 0.8rem;
`;

const LoginText = styled.p`
  color: rgb(var(--textSecondary));
  font-size: 1.3rem;
  margin: 0;
`;

const LoginButton = styled.button`
  background: transparent;
  border: 2px solid rgb(var(--primary));
  color: rgb(var(--primary));
  padding: 1rem 2rem;
  border-radius: 0.6rem;
  font-size: 1.4rem;
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

const LanguageConfirmation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 1rem;
  animation: ${bounceIn} 0.6s ease-out;
  gap: 1rem;
`;

const SuccessMessage = styled.p`
  color: rgb(var(--text));
  font-size: 1.6rem;
  margin-top: 1rem;
  line-height: 1.4;
  animation: ${fadeInUp} 0.5s ease-out;

  strong {
    color: rgb(var(--primary));
    font-weight: 600;
  }
`;

const SkipSection = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const SkipButton = styled.button`
  background: transparent;
  border: none;
  color: rgb(var(--textSecondary));
  padding: 1rem;
  font-size: 1.4rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: underline;

  &:hover:not(:disabled) {
    color: rgb(var(--text));
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: rgb(var(--textSecondary));
  opacity: 0.3;
`;

const DividerText = styled.span`
  margin: 0 1.2rem;
  color: rgb(var(--textSecondary));
  font-size: 1.3rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.4rem;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 0.6rem;
  font-size: 1.5rem;
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