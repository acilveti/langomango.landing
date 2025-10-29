import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useVisitor } from "contexts/VisitorContext";
import { APP_URL, createTrialSubscription, TriggerRegisterEmail } from "services/apiService";

export default function FreeTrialCheckout() {
    const visitor = useVisitor();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const createTrial = async () => {
            // Check if user is authenticated
            if (!visitor.token) {
                console.error('No authentication token found');
                setError('Authentication required. Please sign up first.');
                setIsProcessing(false);
                return;
            }

            try {
                setIsProcessing(true);
                setError(null);

                console.log('Creating free trial subscription...');

                // Call the backend to create trial subscription
                const response = await createTrialSubscription(visitor.token);

                console.log('Trial subscription created:', response);

                // Small delay to show success message
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Channel-specific redirects
                switch (visitor.signupChannel) {
                    case 'Google':
                        console.log('Redirecting to Google bridge sign-up');
                        window.location.href = APP_URL + '/google-bridge-sign-up?token=' + visitor.token;
                        break;
                    case 'email':
                        console.log('Triggering registration email and redirecting to verification');
                        if (visitor.email) {
                            await TriggerRegisterEmail({ email: visitor.email }, visitor.token);
                        }
                        router.replace('/verification');
                        break;
                    default:
                        // Fallback to onboarding
                        console.log('No signup channel specified, redirecting to onboarding');
                        window.location.href = APP_URL + '/onboarding?token=' + visitor.token;
                }
            } catch (error) {
                console.error('Error creating trial subscription:', error);
                setError(error instanceof Error ? error.message : 'Failed to create trial subscription. Please try again.');
                setIsProcessing(false);
            }
        };

        createTrial();
    }, [visitor.token, visitor.signupChannel, visitor.email, router]);

    const handleRetry = () => {
        setError(null);
        setIsProcessing(true);
        // Trigger useEffect by updating state
        window.location.reload();
    };

    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <StyledPageWrapper>
            <StyledContentContainer>
                {isProcessing ? (
                    <>
                        <StyledSpinner />
                        <StyledTitle>Setting up your free trial</StyledTitle>
                        <StyledSubtitle>You will be redirected in a few seconds...</StyledSubtitle>
                        <StyledProgressBar>
                            <StyledProgressFill />
                        </StyledProgressBar>
                    </>
                ) : error ? (
                    <>
                        <StyledErrorIcon>⚠️</StyledErrorIcon>
                        <StyledTitle>Oops! Something went wrong</StyledTitle>
                        <StyledErrorMessage>{error}</StyledErrorMessage>
                        <StyledButtonGroup>
                            <StyledRetryButton onClick={handleRetry}>
                                Try Again
                            </StyledRetryButton>
                            <StyledBackButton onClick={handleGoBack}>
                                Go Back
                            </StyledBackButton>
                        </StyledButtonGroup>
                    </>
                ) : null}
            </StyledContentContainer>
        </StyledPageWrapper>
    );
}

// Styled Components
const StyledPageWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const StyledContentContainer = styled.div`
    max-width: 500px;
    width: 100%;
    background: white;
    border-radius: 1.5rem;
    padding: 4rem 3rem;
    text-align: center;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
    animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes slideUp {
        from {
            transform: translateY(40px) scale(0.95);
            opacity: 0;
        }
        to {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }
`;

const StyledSpinner = styled.div`
    width: 64px;
    height: 64px;
    border: 6px solid #f3f4f6;
    border-top-color: #ff6b00;
    border-radius: 50%;
    margin: 0 auto 2rem;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const StyledTitle = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #1a1a1a;
    margin: 0 0 1rem;
    line-height: 1.2;
`;

const StyledSubtitle = styled.p`
    font-size: 1.2rem;
    color: #6b7280;
    margin: 0 0 2rem;
    line-height: 1.5;
`;

const StyledProgressBar = styled.div`
    width: 100%;
    height: 6px;
    background: #f3f4f6;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 2rem;
`;

const StyledProgressFill = styled.div`
    height: 100%;
    background: linear-gradient(90deg, #ff6b00 0%, #ff8533 100%);
    border-radius: 3px;
    animation: progress 2s ease-in-out infinite;

    @keyframes progress {
        0% {
            width: 0%;
        }
        50% {
            width: 70%;
        }
        100% {
            width: 100%;
        }
    }
`;

const StyledErrorIcon = styled.div`
    font-size: 4rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const StyledErrorMessage = styled.p`
    font-size: 1.1rem;
    color: #ef4444;
    margin: 0 0 2rem;
    padding: 1rem;
    background: #fee2e2;
    border-radius: 0.5rem;
    border: 1px solid #fca5a5;
`;

const StyledButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
`;

const StyledRetryButton = styled.button`
    background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 3rem;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 6px 16px rgba(255, 107, 0, 0.35);

    &:hover {
        background: linear-gradient(135deg, #ff8533 0%, #ff6b00 100%);
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(255, 107, 0, 0.45);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 6px 16px rgba(255, 107, 0, 0.35);
    }
`;

const StyledBackButton = styled.button`
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;
    padding: 1rem 2.5rem;
    border-radius: 3rem;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        background: #f9fafb;
        border-color: #9ca3af;
        color: #374151;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
`;
