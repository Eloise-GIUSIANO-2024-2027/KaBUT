import { useMemo } from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors, UiTokens } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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

function parseResultPayload(value?: string | string[]): QuizResultPayload | null {
  if (!value || Array.isArray(value)) {
    return null;
  }

  try {
    return JSON.parse(value) as QuizResultPayload;
  } catch {
    return null;
  }
}

export default function QuizPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ result?: string }>();
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];
  const result = useMemo(() => parseResultPayload(params.result), [params.result]);

  const total = result?.total ?? 0;
  const correct = result?.correct ?? 0;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  const prefix = theme === 'dark' ? 'd' : 'l';
  const degrees = useMemo(() => Math.max(0, Math.min(100, score)) * 3.6, [score]);

  const webPageStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `var(--${prefix}-bg-color)`,
        } as const)
      : null;

  const pieStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `conic-gradient(var(--${prefix}-primary-color) 0deg ${degrees}deg, rgba(255, 255, 255, 0.25) ${degrees}deg 360deg)`,
          transition: 'background-image var(--transition-default)',
        } as const)
      : ({
          borderColor: palette.primary,
          borderWidth: 14,
          backgroundColor: palette.surface,
        } as const);

  return (
    <View style={[styles.page, { backgroundColor: palette.bg }, webPageStyle]}>
      <View style={[styles.card, { backgroundColor: palette.surface }]}>
        <ThemedText type="title">Résultat du quiz</ThemedText>

        <View style={[styles.pie, pieStyle]}>
          <View style={[styles.pieCenter, { backgroundColor: palette.surface }]}>
            <ThemedText type="subtitle" style={[styles.scoreText, { color: palette.text }]}>
              {score}%
            </ThemedText>
          </View>
        </View>

        <ThemedText style={[styles.helperText, { color: palette.text }]}>
          {total > 0
            ? `Tu as ${correct} bonne${correct > 1 ? 's' : ''} réponse${correct > 1 ? 's' : ''} sur ${total}.`
            : 'Aucun résultat disponible. Lance un quiz pour voir ton score.'}
        </ThemedText>

        <View style={styles.actions}>
          <Pressable
            onPress={() =>
              router.replace({
                pathname: '/quiz' as never,
                params: { refresh: Date.now().toString() },
              })
            }
            style={[
              styles.button,
              { backgroundColor: palette.secondary },
              Platform.OS === 'web' && styles.webButtonTransition,
            ]}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Refaire
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push('/menu')}
            style={[
              styles.button,
              { backgroundColor: palette.primary },
              Platform.OS === 'web' && styles.webButtonTransition,
            ]}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Continuer
            </ThemedText>
          </Pressable>
        </View>
      </View>
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
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: UiTokens.radiusDefault,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  pie: {
    width: 200,
    height: 200,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieCenter: {
    width: 130,
    height: 130,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 34,
    lineHeight: 42,
  },
  helperText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 460,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    minWidth: 140,
    borderRadius: UiTokens.radiusButton,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  webButtonTransition: {
    transitionProperty: 'transform, background-color',
    transitionDuration: '0.2s',
  },
});

