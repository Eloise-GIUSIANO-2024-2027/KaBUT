import { useMemo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import quizData from '@/constants/data.json';
import { ThemedText } from '@/components/themed-text';
import { Colors, UiTokens } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Question = {
  id: number;
  quizz_id: number;
  question: string;
  options: string[];
  answer: string;
};

type QuizResultPayload = {
  total: number;
  correct: number;
  answers: {
    questionId: number;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
};

const QUESTIONS_PER_QUIZ = 3;

function pickRandomQuestions(questions: Question[], count: number) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export default function QuizScreen() {
  const router = useRouter();
  const { refresh } = useLocalSearchParams<{ refresh?: string }>();
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];

  const allQuestions = useMemo(() => (quizData.questions ?? []) as Question[], []);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    setQuestions(pickRandomQuestions(allQuestions, QUESTIONS_PER_QUIZ));
    setAnswers({});
  }, [allQuestions, refresh]);

  const answeredCount = useMemo(
    () => questions.filter((q) => typeof answers[q.id] === 'string').length,
    [answers, questions]
  );

  const canSubmit = questions.length > 0 && answeredCount === questions.length;
  const prefix = theme === 'dark' ? 'd' : 'l';

  const webPageStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `var(--${prefix}-bg-color)`,
        } as const)
      : null;

  const onSubmit = () => {
    const detail = questions.map((question) => {
      const selectedAnswer = answers[question.id] ?? '';
      const isCorrect = selectedAnswer === question.answer;

      return {
        questionId: question.id,
        question: question.question,
        selectedAnswer,
        correctAnswer: question.answer,
        isCorrect,
      };
    });

    const payload: QuizResultPayload = {
      total: questions.length,
      correct: detail.filter((item) => item.isCorrect).length,
      answers: detail,
    };

    router.push({
      pathname: '/quiz-result',
      params: {
        result: JSON.stringify(payload),
      },
    });
  };

  return (
    <View style={[styles.page, { backgroundColor: palette.bg }, webPageStyle]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator>
        <View style={[styles.card, { backgroundColor: palette.surface }]}>
          <ThemedText type="title" style={styles.titleText}>Quiz aléatoire</ThemedText>
          <ThemedText style={[styles.helperText, { color: palette.text }]}>Réponds aux 3 questions, puis valide tes réponses.</ThemedText>

          {questions.map((question, index) => (
            <View key={question.id} style={[styles.questionBlock, { borderColor: 'rgba(128,128,128,0.25)' }]}>
              <ThemedText type="defaultSemiBold">{index + 1}. {question.question}</ThemedText>

              <View style={styles.optionsList}>
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: isSelected ? palette.primary : 'rgba(128,128,128,0.35)',
                          backgroundColor: isSelected ? palette.primary : 'transparent',
                        },
                      ]}>
                      <ThemedText style={{ color: isSelected ? '#FFFFFF' : palette.text }}>{option}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <Pressable
            onPress={onSubmit}
            disabled={!canSubmit}
            style={[
              styles.submitButton,
              {
                backgroundColor: canSubmit ? palette.primary : 'rgba(128,128,128,0.5)',
              },
            ]}>
            <ThemedText type="defaultSemiBold" style={styles.submitText}>
              Valider mes réponses ({answeredCount}/{questions.length})
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: UiTokens.radiusDefault,
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  titleText: {
    textAlign: 'center',
  },
  helperText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
  questionBlock: {
    width: '100%',
    gap: 10,
    borderWidth: 1,
    borderRadius: UiTokens.radiusButton,
    padding: 12,
  },
  optionsList: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: UiTokens.radiusButton,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
    borderRadius: UiTokens.radiusButton,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
  },
});

