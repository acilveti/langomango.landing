import React, { useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Image from 'next/image';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import SectionTitle from 'components/SectionTitle';
import { media } from 'utils/media';
import { useTranslation } from 'next-i18next';
import { useSignupModalContext } from 'contexts/SignupModalContext';

// Add props interface
interface FeaturesGalleryProps {
  title?: string;
  overTitle?: string;
}

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ExampleText {
  beforeWord: string;
  highlightedWord: string;
  afterWord: string;
  translation?: string;
}

interface HighlightedWordData {
  word: string;
  translation: string;
}

interface Benefit {
  icon: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  questionKey: string;
  exampleText?: ExampleText;
  multipleWordsText?: {
    parts: Array<{ text: string; highlight?: HighlightedWordData }>;
  };
  options: QuizOption[];
  methodBadge: string;
  introText: string;
  explanationTitle: string;
  explanationText: string;
  benefits: Benefit[];
  hideTranslationInQuiz?: boolean;
}

export default function FeaturesGallery({ title, overTitle }: FeaturesGalleryProps) {
  const { t } = useTranslation();
  const { setIsModalOpened } = useSignupModalContext();

  // Define quiz questions
  const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
      id: 1,
      questionKey: 'features.quiz.question1',
      exampleText: {
        beforeWord: 'I like to read  ',
        highlightedWord: 'libros',
        afterWord: ' in Spanish.',
        translation: '',
      },
      options: [
        { id: 'q1-a', text: 'books', isCorrect: true },
        { id: 'q1-b', text: 'libraries', isCorrect: false },
        { id: 'q1-c', text: 'food', isCorrect: false },
      ],
      methodBadge: 'Context-Based Learning',
      introText: 'What you just experienced is context-based learning',
      explanationTitle: 'Learn by Reading',
      explanationText: 'Context-based guessing creates stronger memory connections than passive memorization.',
      benefits: [
        { icon: '🧠', text: 'Better retention' },
        { icon: '⚡', text: 'Faster learning' },
        { icon: '🎨', text: 'Natural flow' },
      ],
    },
    {
      id: 2,
      questionKey: 'features.quiz.question2',
      exampleText: {
        beforeWord: 'The ',
        highlightedWord: 'reunión',
        afterWord: ' was boring.',
        translation: 'meeting',
      },
      options: [
        { id: 'q2-a', text: 'Yes', isCorrect: true },
        { id: 'q2-b', text: 'No', isCorrect: true },
      ],
      hideTranslationInQuiz: true,
      methodBadge: 'Visual-Pairing Learning',
      introText: 'Don\'t know a word? Is normal, this is why we include the translation',
      explanationTitle: 'Visual-Pairing Learning',
      explanationText: 'This visual pairing of words with their meanings, combined with repetitive exposure as you read, creates powerful memory associations that stick with you long-term.',
      benefits: [
        { icon: '👁️', text: 'Visual pairing' },
        { icon: '🔄', text: 'Repetitive exposure' },
        { icon: '💡', text: 'Natural retention' },
      ],
    },
    {
      id: 3,
      questionKey: 'features.quiz.question3',
      multipleWordsText: {
        parts: [
          { text: 'Yesterday I went to the ' },
          { text: 'mercado', highlight: { word: 'mercado', translation: 'market' } },
          { text: ' with my friend. We bought fresh ' },
          { text: 'frutas', highlight: { word: 'frutas', translation: 'fruits' } },
          { text: ' and vegetables. The ' },
          { text: 'vendedor', highlight: { word: 'vendedor', translation: 'seller' } },
          { text: ' was very friendly and helped us choose the best products.' },
        ],
      },
      options: [
        { id: 'q3-a', text: 'Start Free Trial', isCorrect: true },
      ],
      methodBadge: 'Context-Based Learning',
      introText: 'What you just experienced is context-based learning',
      explanationTitle: 'Ready to Start Learning?',
      explanationText: 'Experience context-based learning with instant visual translations. Start reading in your target language today.',
      benefits: [
        { icon: '🧠', text: 'Better retention' },
        { icon: '⚡', text: 'Faster learning' },
        { icon: '🎨', text: 'Natural flow' },
      ],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const featuresGalleryRef = useRef<HTMLDivElement>(null);
  const quizContainerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;

  function handleOptionSelect(option: QuizOption) {
    if (showFeedback) return; // Prevent selecting when feedback is showing

    setHasInteracted(true);
    setSelectedOption(option.id);
    setIsCorrect(option.isCorrect);

    // If it's the last question and the option is the CTA, open modal directly
    if (isLastQuestion && option.text === 'Start Free Trial') {
      setIsModalOpened(true);
      return;
    }

    // If correct, show explanation directly
    if (option.isCorrect) {
      setShowFeedback(true);

      // Move to explanation quickly
      setTimeout(() => {
        setShowFeedback(false);
        setShowExplanation(true);

        // Scroll after expansion to show the quiz explanation
        setTimeout(() => {
          if (quizContainerRef.current) {
            const elementRect = quizContainerRef.current.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const offset = 80; // Top padding for better visibility
            const targetPosition = absoluteElementTop - offset;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }, 600);
    } else {
      // If incorrect, show brief feedback and reset
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
      }, 800);
    }
  }

  function handleContinue() {
    setShowExplanation(false);
    setSelectedOption(null);
    setHasInteracted(false);

    if (isLastQuestion) {
      setIsModalOpened(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }

  return (
    <FeaturesGalleryWrapper ref={featuresGalleryRef}>
      <HeaderContainer>
        {(overTitle || t('features.overTitle')) && (
          <CustomOverTitle>{overTitle || t('features.overTitle') || 'How it works'}</CustomOverTitle>
        )}
        {(title || t('features.title')) && (
          <Title>{title || t('features.title') || 'Experience Language Learning'}</Title>
        )}
      </HeaderContainer>

      <QuizContainer ref={quizContainerRef}>
        {showExplanation ? (
          // Explanation View
          <ExplanationCard>
            <MethodBadge>{currentQuestion.methodBadge}</MethodBadge>
            <ExplanationIconLarge>🎯</ExplanationIconLarge>
            <IntroText>{currentQuestion.introText}</IntroText>
            <ExplanationTitle>{currentQuestion.explanationTitle}</ExplanationTitle>

            {/* Show the example again for reinforcement */}
            <ExampleTextContainer>
              <ExampleSentence>
                {currentQuestion.multipleWordsText ? (
                  // Render multiple highlighted words
                  currentQuestion.multipleWordsText.parts.map((part, idx) => {
                    if (part.highlight) {
                      return (
                        <WordWithTooltip key={idx}>
                          <TooltipTranslationFinal>{part.highlight.translation}</TooltipTranslationFinal>
                          <HighlightedWordFinal>{part.highlight.word}</HighlightedWordFinal>
                        </WordWithTooltip>
                      );
                    }
                    return <span key={idx}>{part.text}</span>;
                  })
                ) : currentQuestion.exampleText ? (
                  // Render single highlighted word
                  <>
                    {currentQuestion.exampleText.beforeWord}
                    {currentQuestion.exampleText.translation ? (
                      <WordWithTooltip>
                        <TooltipTranslation>{currentQuestion.exampleText.translation}</TooltipTranslation>
                        <HighlightedWord>{currentQuestion.exampleText.highlightedWord}</HighlightedWord>
                      </WordWithTooltip>
                    ) : (
                      <HighlightedWord>{currentQuestion.exampleText.highlightedWord}</HighlightedWord>
                    )}
                    {currentQuestion.exampleText.afterWord}
                  </>
                ) : null}
              </ExampleSentence>
            </ExampleTextContainer>

            <ExplanationText>{currentQuestion.explanationText}</ExplanationText>

            <BenefitsTitle>Why it works:</BenefitsTitle>
            <BenefitsList>
              {currentQuestion.benefits.map((benefit, idx) => (
                <BenefitItem key={idx}>
                  <BenefitIcon>{benefit.icon}</BenefitIcon>
                  <BenefitText>{benefit.text}</BenefitText>
                </BenefitItem>
              ))}
            </BenefitsList>

            <ContinueButton onClick={handleContinue}>
              {isLastQuestion ? 'Start Learning' : 'Continue'}
            </ContinueButton>
          </ExplanationCard>
        ) : (
          // Quiz View
          <QuestionCard>
            <QuestionNumber>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</QuestionNumber>

            {/* Introductory text for question 3 */}
            {currentQuestion.multipleWordsText && (
              <BookPreviewIntro>
                This is how a book in LangoMango looks like: readable, enjoyable, and a productive learning experience!
              </BookPreviewIntro>
            )}

            {/* Example text with highlighted word */}
            <ExampleTextContainer>
              <ExampleSentence>
                {currentQuestion.multipleWordsText ? (
                  // Render multiple highlighted words
                  currentQuestion.multipleWordsText.parts.map((part, idx) => {
                    if (part.highlight) {
                      return (
                        <WordWithTooltip key={idx}>
                          <TooltipTranslationFinal>{part.highlight.translation}</TooltipTranslationFinal>
                          <HighlightedWordFinal>{part.highlight.word}</HighlightedWordFinal>
                        </WordWithTooltip>
                      );
                    }
                    return <span key={idx}>{part.text}</span>;
                  })
                ) : currentQuestion.exampleText ? (
                  // Render single highlighted word
                  <>
                    {currentQuestion.exampleText.beforeWord}
                    {currentQuestion.exampleText.translation && !currentQuestion.hideTranslationInQuiz ? (
                      <WordWithTooltip>
                        <TooltipTranslation>{currentQuestion.exampleText.translation}</TooltipTranslation>
                        <HighlightedWord>{currentQuestion.exampleText.highlightedWord}</HighlightedWord>
                      </WordWithTooltip>
                    ) : (
                      <HighlightedWord>{currentQuestion.exampleText.highlightedWord}</HighlightedWord>
                    )}
                    {currentQuestion.exampleText.afterWord}
                  </>
                ) : null}
              </ExampleSentence>
            </ExampleTextContainer>


            <QuestionText>
              {t(currentQuestion.questionKey) || 'What is the best way to learn a language?'}
            </QuestionText>

            {!currentQuestion.multipleWordsText && (
              <WordPrompt>
                {currentQuestion.hideTranslationInQuiz
                  ? `Are you able to know the meaning of "${currentQuestion.exampleText?.highlightedWord}"?`
                  : `What does "${currentQuestion.exampleText?.highlightedWord}" mean?`}
              </WordPrompt>
            )}

            {currentQuestion.multipleWordsText && (
              <CallToActionPrompt>
                Ready to learn? Start reading today.
              </CallToActionPrompt>
            )}

            <OptionsGrid columnsCount={currentQuestion.options.length}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === option.id;
                const showCorrect = showFeedback && isSelected && isCorrect;
                const showIncorrect = showFeedback && isSelected && !isCorrect;

                return (
                  <OptionCard
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    isSelected={isSelected}
                    showCorrect={showCorrect}
                    showIncorrect={showIncorrect}
                    disabled={showFeedback}
                    hasInteracted={hasInteracted}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <OptionText>{option.text}</OptionText>
                    {showCorrect && <Checkmark>✓</Checkmark>}
                    {showIncorrect && <CrossMark>✗</CrossMark>}
                  </OptionCard>
                );
              })}
            </OptionsGrid>

            {showFeedback && !isCorrect && (
              <FeedbackMessage isCorrect={false}>
                Try another answer!
              </FeedbackMessage>
            )}
          </QuestionCard>
        )}

        <ProgressBar>
          {QUIZ_QUESTIONS.map((_, idx) => (
            <ProgressDot key={idx} isActive={idx === currentQuestionIndex} isCompleted={idx < currentQuestionIndex} />
          ))}
        </ProgressBar>
      </QuizContainer>

      {/* Platform Availability Section */}
      <PlatformAvailabilitySection>
        {/* Content Options */}
        <ContentOptionsTitle>Your Content, Your Way</ContentOptionsTitle>
        <ContentOptionsGrid>
          <ContentOptionCard>
            <ContentIcon>📚</ContentIcon>
            <ContentOptionTitle>Upload Your Own eBooks</ContentOptionTitle>
            <ContentOptionDescription>
              Bring your personal library and learn with books you love. Support for popular formats.
            </ContentOptionDescription>
          </ContentOptionCard>

          <ContentOptionCard>
            <ContentIcon>🎁</ContentIcon>
            <ContentOptionTitle>Free Catalog Available</ContentOptionTitle>
            <ContentOptionDescription>
              Access our curated collection of free books. Start reading immediately with quality content.
            </ContentOptionDescription>
          </ContentOptionCard>
        </ContentOptionsGrid>
      </PlatformAvailabilitySection>
    </FeaturesGalleryWrapper>
  );
}

const Description = styled.div`
  font-size: 1.8rem;
  items-align: center;
  max-width: 60%;
  margin: 0 auto 4rem;

  ${media('<=tablet')} {
    max-width: 100%;
  }
`;

// Keyframe animations - B2C SaaS style
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const excitedBounce = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
    box-shadow: 0 4px 15px rgba(245, 162, 1, 0.25);
  }
  25% {
    transform: translateY(-8px) scale(1.05) rotate(-1deg);
    box-shadow: 0 10px 25px rgba(245, 162, 1, 0.4);
  }
  50% {
    transform: translateY(0) scale(1.03) rotate(0deg);
    box-shadow: 0 6px 20px rgba(245, 162, 1, 0.35);
  }
  75% {
    transform: translateY(-4px) scale(1.02) rotate(1deg);
    box-shadow: 0 8px 22px rgba(245, 162, 1, 0.38);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 162, 1, 0.7);
    border-color: rgba(245, 162, 1, 0.5);
  }
  50% {
    box-shadow: 0 0 20px 8px rgba(245, 162, 1, 0);
    border-color: rgb(245, 162, 1);
  }
`;

const shimmerSweep = keyframes`
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(300%) rotate(45deg);
  }
`;

const successBurst = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 162, 1, 0.5);
  }
  30% {
    transform: scale(1.15);
    box-shadow: 0 0 30px 15px rgba(245, 162, 1, 0);
  }
  50% {
    transform: scale(0.95) rotate(-3deg);
  }
  70% {
    transform: scale(1.08) rotate(3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 0 rgba(245, 162, 1, 0);
  }
`;

const errorShake = keyframes`
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  15% {
    transform: translateX(-10px) rotate(-2deg);
  }
  30% {
    transform: translateX(10px) rotate(2deg);
  }
  45% {
    transform: translateX(-8px) rotate(-1.5deg);
  }
  60% {
    transform: translateX(8px) rotate(1.5deg);
  }
  75% {
    transform: translateX(-4px) rotate(-0.5deg);
  }
  90% {
    transform: translateX(4px) rotate(0.5deg);
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
  60% {
    transform: scale(1.1) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// Styled Components - Readlang-inspired design
const FeaturesGalleryWrapper = styled(Container)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 6rem 2rem;

  ${media('<=tablet')} {
    padding: 4rem 1.5rem;
    min-height: 100vh;
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: 4rem;
  width: 100%;
  max-width: 800px;

  ${media('<=tablet')} {
    margin-bottom: 3rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 0;
  letter-spacing: -0.03em;
  max-width: 100%;

  ${media('<=tablet')} {
    font-size: 4.6rem;
  }
`;

const QuizContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 1.2rem;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: min-height 0.5s ease, max-height 0.5s ease;

  ${media('<=tablet')} {
    padding: 2rem 1.5rem;
    border-radius: 1rem;
  }
`;

const QuestionNumber = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: rgb(245, 162, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
`;

const BookPreviewIntro = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgb(var(--textPrimary));
  text-align: center;
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(245, 162, 1, 0.08) 0%, rgba(245, 162, 1, 0.03) 100%);
  border-radius: 1rem;
  border-left: 4px solid rgb(245, 162, 1);

  ${media('<=tablet')} {
    font-size: 1.5rem;
    padding: 1.2rem 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ExampleTextContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;

  ${media('<=tablet')} {
    padding: 1.5rem;
    margin: 1.5rem 0;
  }
`;

const ExampleSentence = styled.p`
  font-size: 2.2rem;
  font-weight: 500;
  line-height: 2.2;
  color: rgb(var(--text));
  margin: 0;
  text-align: justify;
  padding: 1rem 0;

  ${media('<=tablet')} {
    font-size: 1.8rem;
    line-height: 2;
  }
`;

const WordWithTooltip = styled.span`
  position: relative;
  display: inline-block;
  margin: 0 0.2rem;
  padding: 0 0.3rem;
`;

const TooltipTranslation = styled.span`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(100, 116, 139, 0.95);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;

  /* Arrow pointing down */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(100, 116, 139, 0.95);
  }

  ${media('<=tablet')} {
    font-size: 1.1rem;
    padding: 0.4rem 0.8rem;
    margin-bottom: 0.6rem;

    &::after {
      border-width: 4px;
    }
  }
`;

const HighlightedWord = styled.span`
  color: rgb(245, 162, 1);
  background: rgba(245, 162, 1, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid rgb(245, 162, 1);

  &:hover {
    background: rgba(245, 162, 1, 0.2);
    transform: translateY(-1px);
  }
`;

const TooltipTranslationFinal = styled.span`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  margin-bottom: 0.8rem;
  z-index: 10;

  

  ${media('<=tablet')} {
    font-size: 1.1rem;
    padding: 0.4rem 0.8rem;
    margin-bottom: 0.6rem;

    &::after {
      border-width: 4px;
    }
  }
`;

const HighlightedWordFinal = styled.span`
  color: rgb(245, 162, 1);
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(245, 162, 1, 0.2);
    transform: translateY(-1px);
  }
`;

const TranslationHint = styled.span`
  display: inline-block;
  font-size: 1.4rem;
  color: #64748b;
  font-style: italic;
  margin-top: 0.5rem;

  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const PromptText = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 1rem;
  text-align: left;

  ${media('<=tablet')} {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
`;

const QuestionText = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--textSecondary));
  margin-bottom: 1.5rem;
  line-height: 1.4;

  ${media('<=tablet')} {
    font-size: 1.7rem;
    margin-bottom: 1.2rem;
  }
`;

const WordPrompt = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  color: rgb(var(--text));
  margin-bottom: 2rem;
  text-align: left;

  ${media('<=tablet')} {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const CallToActionPrompt = styled.p`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgb(var(--textSecondary));
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }
`;

const HighlightSpan = styled.span`
  color: rgb(245, 162, 1);
  font-weight: 700;
`;

const OptionsGrid = styled.div<{ columnsCount: number }>`
  display: grid;
  grid-template-columns: ${(p) => `repeat(${p.columnsCount}, 1fr)`};
  gap: 1.2rem;

  ${media('<=tablet')} {
    gap: 0.8rem;
  }
`;

const OptionCard = styled.button<{
  isSelected: boolean;
  showCorrect: boolean;
  showIncorrect: boolean;
  disabled: boolean;
  hasInteracted: boolean;
}>`
  position: relative;
  padding: 1.5rem 1rem;
  background: ${(p) =>
    p.showCorrect
      ? 'linear-gradient(135deg, rgba(245, 162, 1, 0.15) 0%, rgba(245, 162, 1, 0.05) 100%)'
      : p.showIncorrect
        ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
        : 'linear-gradient(135deg, rgb(var(--cardBackground)) 0%, rgba(245, 162, 1, 0.05) 100%)'};
  border: 3px solid
    ${(p) =>
    p.showCorrect ? 'rgb(245, 162, 1)' : p.showIncorrect ? '#ef4444' : p.isSelected ? 'rgb(245, 162, 1)' : '#e2e8f0'};
  border-radius: 1.2rem;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: center;
  font-size: 1.6rem;
  font-weight: 700;
  color: rgb(var(--text));
  opacity: ${(p) => (p.disabled && !p.isSelected ? 0.4 : 1)};
  overflow: hidden;
  animation: ${(p) =>
    p.showCorrect
      ? successBurst
      : p.showIncorrect
        ? errorShake
        : !p.hasInteracted
          ? excitedBounce
          : 'none'}
    ${(p) => (p.showCorrect || p.showIncorrect ? '0.6s' : '2s')}
    ${(p) => (p.showCorrect || p.showIncorrect ? 'ease-out' : 'ease-in-out')}
    ${(p) => (p.showCorrect || p.showIncorrect ? '1' : 'infinite')};

  /* Glow pulse animation */
  ${(p) =>
    !p.hasInteracted &&
    !p.disabled &&
    css`
      animation: ${excitedBounce} 2s ease-in-out infinite, ${glowPulse} 2s ease-in-out infinite;
    `}

  /* Shimmer effect overlay */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 30%;
    height: 200%;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 100%
    );
    opacity: ${(p) => (p.hasInteracted ? 0 : 0.7)};
    ${(p) =>
    !p.hasInteracted &&
    css`
        animation: ${shimmerSweep} 3s ease-in-out infinite;
      `}
    pointer-events: none;
  }

  /* Glow effect on hover */
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 1.2rem;
    background: linear-gradient(135deg, rgb(245, 162, 1), rgba(245, 162, 1, 0.5));
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: -1;
  }

  &:hover {
    ${(p) =>
    !p.disabled &&
    !p.hasInteracted &&
    css`
        border-color: rgb(245, 162, 1);
        box-shadow: 0 10px 40px rgba(245, 162, 1, 0.5), 0 0 0 4px rgba(245, 162, 1, 0.15);
        transform: translateY(-6px) scale(1.08) rotate(-1deg);
        animation: none;
      `}
  }

  &:hover::after {
    opacity: ${(p) => (p.disabled || p.hasInteracted ? 0 : 0.2)};
  }

  &:active {
    ${(p) =>
    !p.disabled &&
    css`
        transform: translateY(-2px) scale(1.03);
        transition: all 0.1s ease;
      `}
  }

  ${media('<=tablet')} {
    padding: 1.2rem 0.8rem;
    font-size: 1.4rem;
    border-width: 2px;
  }
`;

const OptionText = styled.span`
  display: block;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
`;

const Checkmark = styled.span`
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  font-size: 2.5rem;
  color: rgb(245, 162, 1);
  font-weight: bold;
  z-index: 2;
  animation: ${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 2px 8px rgba(245, 162, 1, 0.5));

  ${media('<=tablet')} {
    font-size: 2rem;
    right: 1rem;
  }
`;

const CrossMark = styled.span`
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  font-size: 2.5rem;
  color: #ef4444;
  font-weight: bold;
  z-index: 2;
  animation: ${errorShake} 0.6s ease-out;
  filter: drop-shadow(0 2px 8px rgba(239, 68, 68, 0.5));

  ${media('<=tablet')} {
    font-size: 2rem;
    right: 1rem;
  }
`;

const FeedbackMessage = styled.div<{ isCorrect: boolean }>`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 0.8rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  animation: ${fadeIn} 0.3s ease;
  background: ${(p) => (p.isCorrect ? 'rgba(245, 162, 1, 0.1)' : '#fef3c7')};
  color: ${(p) => (p.isCorrect ? 'rgb(245, 162, 1)' : '#92400e')};
  border: 1px solid ${(p) => (p.isCorrect ? 'rgb(245, 162, 1)' : '#f59e0b')};
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
`;

const ProgressDot = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => (p.isCompleted ? 'rgb(245, 162, 1)' : p.isActive ? 'rgb(245, 162, 1)' : '#e5e7eb')};
  opacity: ${(p) => (p.isActive ? 1 : p.isCompleted ? 0.6 : 0.3)};
  transition: all 0.3s ease;
  transform: ${(p) => (p.isActive ? 'scale(1.3)' : 'scale(1)')};
`;

// Explanation View Styled Components
const ExplanationCard = styled.div`
  background: white;
  border-radius: 1.2rem;
  padding: 4rem 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
  position: relative;
  min-height: max(600px, 60vh);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: min-height 0.5s ease, max-height 0.5s ease;

  ${media('<=tablet')} {
    padding: 1.5rem 1.5rem;
    border-radius: 1rem;
    min-height: max(500px, 70vh);
  }
`;

const MethodBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, rgb(245, 162, 1) 0%, rgb(230, 145, 0) 100%);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(245, 162, 1, 0.3);
  animation: ${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${media('<=tablet')} {
    font-size: 1.3rem;
    padding: 0.7rem 1.5rem;
    margin-bottom: 0.8rem;
  }
`;

const ExplanationIconLarge = styled.div`
  font-size: 5rem;
  margin: 0 auto 1.5rem;
  animation: ${popIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${media('<=tablet')} {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
`;

const IntroText = styled.p`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.5;

  ${media('<=tablet')} {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const ExplanationTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  color: rgb(var(--textSecondary));
  margin-bottom: 1.5rem;
  line-height: 1.3;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }
`;

const ExplanationText = styled.p`
  font-size: 1.8rem;
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  ${media('<=tablet')} {
    font-size: 1.5rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`;

const BenefitsTitle = styled.h4`
  font-size: 1.8rem;
  font-weight: 700;
  color: rgb(var(--textSecondary));
  margin-bottom: 1.5rem;
  margin-top: 2rem;

  ${media('<=tablet')} {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    margin-top: 1rem;
  }
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;

  ${media('<=tablet')} {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.2rem 0.8rem;
  background: linear-gradient(135deg, #fffbf5 0%, #fff8ed 100%);
  border-radius: 0.8rem;
  border: 2px solid rgba(245, 162, 1, 0.4);
  box-shadow: 0 2px 8px rgba(245, 162, 1, 0.12);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${fadeIn} 0.5s ease backwards;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    border-color: rgb(245, 162, 1);
    box-shadow: 0 6px 16px rgba(245, 162, 1, 0.25);
    background: linear-gradient(135deg, #fff8ed 0%, #ffedd5 100%);
  }

  ${media('<=tablet')} {
    padding: 0.6rem 0.6rem;
    gap: 0.3rem;
  }
`;

const BenefitIcon = styled.div`
  font-size: 2.2rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));

  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const BenefitText = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  line-height: 1.3;

  ${media('<=tablet')} {
    font-size: 1.1rem;
  }
`;

const ContinueButton = styled.button`
  padding: 1.2rem 3rem;
  background: rgb(245, 162, 1);
  color: white;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 162, 1, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 162, 1, 0.4);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
  }

  ${media('<=tablet')} {
    padding: 1rem 2.5rem;
    font-size: 1.3rem;
  }
`;

// Platform Availability Section Styled Components
const PlatformAvailabilitySection = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 8rem;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${media('<=tablet')} {
    margin-top: 5rem;
    padding: 0 1.5rem;
  }
`;

const PlatformOverTitle = styled(OverTitle)`
  color: rgb(245, 162, 1);
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;

  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const PlatformTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4rem;
  line-height: 1.3;

  ${media('<=tablet')} {
    font-size: 2.4rem;
    margin-bottom: 3rem;
  }
`;

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  margin-bottom: 6rem;

  ${media('<=tablet')} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }
`;

const DeviceCard = styled.div`
  background: white;
  border-radius: 1.2rem;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(245, 162, 1, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${fadeIn} 0.6s ease backwards;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgb(245, 162, 1);
    box-shadow: 0 12px 30px rgba(245, 162, 1, 0.2);
  }

  ${media('<=tablet')} {
    padding: 2rem 1.5rem;
  }
`;

const DeviceIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));

  ${media('<=tablet')} {
    margin-bottom: 1rem;
  }
`;

const DeviceName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.8rem;

  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const DeviceDescription = styled.p`
  font-size: 1.4rem;
  color: #64748b;
  line-height: 1.6;

  ${media('<=tablet')} {
    font-size: 1.3rem;
  }
`;

const ContentOptionsTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3rem;
  line-height: 1.3;

  ${media('<=tablet')} {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const ContentOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  width: 100%;

  ${media('<=tablet')} {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContentOptionCard = styled.div`
  background: linear-gradient(135deg, #fffbf5 0%, #fff8ed 100%);
  border-radius: 1.5rem;
  padding: 3.5rem 3rem;
  border: 3px solid rgba(245, 162, 1, 0.2);
  box-shadow: 0 6px 24px rgba(245, 162, 1, 0.12);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${fadeIn} 0.6s ease backwards;

  &:nth-child(1) {
    animation-delay: 0.4s;
  }
  &:nth-child(2) {
    animation-delay: 0.5s;
  }

  &:hover {
    transform: translateY(-10px) scale(1.03);
    border-color: rgb(245, 162, 1);
    box-shadow: 0 15px 40px rgba(245, 162, 1, 0.25);
    background: linear-gradient(135deg, #fff8ed 0%, #ffedd5 100%);
  }

  ${media('<=tablet')} {
    padding: 2.5rem 2rem;
  }
`;

const ContentIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  filter: drop-shadow(0 2px 8px rgba(245, 162, 1, 0.2));

  ${media('<=tablet')} {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
`;

const ContentOptionTitle = styled.h4`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.2rem;
  line-height: 1.3;

  ${media('<=tablet')} {
    font-size: 1.7rem;
    margin-bottom: 1rem;
  }
`;

const ContentOptionDescription = styled.p`
  font-size: 1.5rem;
  color: #64748b;
  line-height: 1.7;

  ${media('<=tablet')} {
    font-size: 1.4rem;
    line-height: 1.6;
  }
`;