import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import SectionTitle from 'components/SectionTitle';
import { media } from 'utils/media';
import { useTranslation } from 'next-i18next';
import { useSignupModalContext } from 'contexts/SignupModalContext';

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

interface QuizQuestion {
  id: number;
  questionKey: string;
  exampleText: ExampleText;
  options: QuizOption[];
  explanationTitle: string;
  explanationText: string;
}

export default function FeaturesGallery() {
  const { t } = useTranslation();
  const { setIsModalOpened } = useSignupModalContext();

  // Define quiz questions
  const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
      id: 1,
      questionKey: 'features.quiz.question1',
      exampleText: {
        beforeWord: 'Me gusta leer ',
        highlightedWord: 'libros',
        afterWord: ' en español.',
        translation: 'books',
      },
      options: [
        { id: 'q1-a', text: 'books', isCorrect: true },
        { id: 'q1-b', text: 'libraries', isCorrect: false },
        { id: 'q1-c', text: 'stories', isCorrect: false },
      ],
      explanationTitle: 'Learn by Reading',
      explanationText: 'With LangoMango, you can read authentic content in your target language. When you encounter an unknown word, simply click on it to see the instant translation. This natural, context-based learning helps you remember vocabulary better than traditional memorization.',
    },
    {
      id: 2,
      questionKey: 'features.quiz.question2',
      exampleText: {
        beforeWord: 'The ',
        highlightedWord: 'weather',
        afterWord: ' is beautiful today.',
        translation: 'clima',
      },
      options: [
        { id: 'q2-a', text: 'tiempo', isCorrect: false },
        { id: 'q2-b', text: 'clima', isCorrect: true },
        { id: 'q2-c', text: 'cielo', isCorrect: false },
      ],
      explanationTitle: 'Instant Translations',
      explanationText: 'No need to interrupt your reading flow. LangoMango provides instant, contextual translations for any word you click. The more you read and discover words in context, the faster you learn and retain new vocabulary.',
    },
    {
      id: 3,
      questionKey: 'features.quiz.question3',
      exampleText: {
        beforeWord: 'Je veux ',
        highlightedWord: 'apprendre',
        afterWord: ' le français.',
        translation: 'learn',
      },
      options: [
        { id: 'q3-a', text: 'study', isCorrect: false },
        { id: 'q3-b', text: 'learn', isCorrect: true },
        { id: 'q3-c', text: 'teach', isCorrect: false },
      ],
      explanationTitle: 'Adaptive Learning',
      explanationText: 'LangoMango adapts to your level. Choose content that matches your proficiency, from beginner to advanced. As you progress, the system tracks your vocabulary knowledge and suggests increasingly challenging material to keep you growing.',
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;

  function handleOptionSelect(option: QuizOption) {
    if (showFeedback) return; // Prevent selecting when feedback is showing

    setSelectedOption(option.id);
    setIsCorrect(option.isCorrect);
    setShowFeedback(true);

    // Show explanation or allow retry
    setTimeout(() => {
      if (option.isCorrect) {
        setShowFeedback(false);
        setShowExplanation(true);
      } else {
        setShowFeedback(false);
        setSelectedOption(null);
      }
    }, 1500);
  }

  function handleContinue() {
    setShowExplanation(false);
    setSelectedOption(null);

    if (isLastQuestion) {
      setIsModalOpened(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }

  return (
    <FeaturesGalleryWrapper>
      <Content>
        <OverTitle>{t('features.overTitle') || 'How it works'}</OverTitle>
        <SectionTitle>{t('features.title') || 'Experience Language Learning'}</SectionTitle>
      </Content>

      <QuizContainer>
        {showExplanation ? (
          // Explanation View
          <ExplanationCard>
            <ExplanationIcon>✓</ExplanationIcon>
            <ExplanationTitle>{currentQuestion.explanationTitle}</ExplanationTitle>
            <ExplanationText>{currentQuestion.explanationText}</ExplanationText>
            <ContinueButton onClick={handleContinue}>
              {isLastQuestion ? 'Start Learning' : 'Continue'}
            </ContinueButton>
          </ExplanationCard>
        ) : (
          // Quiz View
          <QuestionCard>
            <QuestionNumber>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</QuestionNumber>

            {/* Example text with highlighted word */}
            <ExampleTextContainer>
              <ExampleSentence>
                {currentQuestion.exampleText.beforeWord}
                <HighlightedWord>{currentQuestion.exampleText.highlightedWord}</HighlightedWord>
                {currentQuestion.exampleText.afterWord}
              </ExampleSentence>
              {currentQuestion.exampleText.translation && (
                <TranslationHint>"{currentQuestion.exampleText.translation}"</TranslationHint>
              )}
            </ExampleTextContainer>

            <QuestionText>
              {t(currentQuestion.questionKey) || 'What is the best way to learn a language?'}
            </QuestionText>

            <OptionsGrid>
              {currentQuestion.options.map((option) => {
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
                  >
                    <OptionText>{option.text}</OptionText>
                    {showCorrect && <Checkmark>✓</Checkmark>}
                    {showIncorrect && <CrossMark>✗</CrossMark>}
                  </OptionCard>
                );
              })}
            </OptionsGrid>

            {showFeedback && (
              <FeedbackMessage isCorrect={isCorrect}>
                {isCorrect
                  ? 'Correct!'
                  : 'Try another answer!'}
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
    </FeaturesGalleryWrapper>
  );
}

// Styled Components - Readlang-inspired design
const FeaturesGalleryWrapper = styled(Container)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 6rem 2rem;

  ${media('<=tablet')} {
    padding: 4rem 1.5rem;
  }
`;

const Content = styled.div`
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
  text-align: center;
  width: 100%;
  max-width: 800px;
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
  line-height: 1.6;
  color: rgb(var(--text));
  margin: 0 0 0.8rem 0;

  ${media('<=tablet')} {
    font-size: 1.8rem;
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

const QuestionText = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--textSecondary));
  margin-bottom: 2.5rem;
  line-height: 1.4;

  ${media('<=tablet')} {
    font-size: 1.7rem;
    margin-bottom: 2rem;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
}>`
  position: relative;
  padding: 1.5rem 1rem;
  background: ${(p) =>
    p.showCorrect ? 'rgba(245, 162, 1, 0.1)' : p.showIncorrect ? '#fee2e2' : 'rgb(var(--cardBackground))'};
  border: 2px solid
    ${(p) =>
      p.showCorrect ? 'rgb(245, 162, 1)' : p.showIncorrect ? '#ef4444' : p.isSelected ? 'rgb(245, 162, 1)' : '#e5e7eb'};
  border-radius: 0.8rem;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  text-align: center;
  font-size: 1.6rem;
  font-weight: 600;
  color: rgb(var(--text));
  opacity: ${(p) => (p.disabled && !p.isSelected ? 0.5 : 1)};

  &:hover {
    ${(p) =>
      !p.disabled &&
      `
      border-color: rgb(245, 162, 1);
      box-shadow: 0 4px 12px rgba(245, 162, 1, 0.25);
      transform: translateY(-2px);
    `}
  }

  &:active {
    transform: translateY(0);
  }

  ${media('<=tablet')} {
    padding: 1.2rem 0.8rem;
    font-size: 1.4rem;
  }
`;

const OptionText = styled.span`
  display: block;
`;

const Checkmark = styled.span`
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  font-size: 2rem;
  color: rgb(245, 162, 1);
  font-weight: bold;
`;

const CrossMark = styled.span`
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #ef4444;
  font-weight: bold;
`;

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

  ${media('<=tablet')} {
    padding: 3rem 2rem;
    border-radius: 1rem;
  }
`;

const ExplanationIcon = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 2rem;
  background: rgb(245, 162, 1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 4px 15px rgba(245, 162, 1, 0.3);

  ${media('<=tablet')} {
    width: 60px;
    height: 60px;
    font-size: 2.5rem;
  }
`;

const ExplanationTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  color: rgb(var(--textSecondary));
  margin-bottom: 1.5rem;
  line-height: 1.3;

  ${media('<=tablet')} {
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }
`;

const ExplanationText = styled.p`
  font-size: 1.6rem;
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  ${media('<=tablet')} {
    font-size: 1.5rem;
    margin-bottom: 2.5rem;
  }
`;

const ContinueButton = styled.button`
  padding: 1.5rem 4rem;
  background: rgb(245, 162, 1);
  color: white;
  border: none;
  border-radius: 0.8rem;
  font-size: 1.6rem;
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
    padding: 1.3rem 3rem;
    font-size: 1.5rem;
  }
`;