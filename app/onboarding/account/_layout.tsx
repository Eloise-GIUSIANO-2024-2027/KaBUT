import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AccountLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1C1C1E' : '#F5F5F5';
  const textColor = colorScheme === 'dark' ? '#F5F5F5' : '#1C1C1E';

  const backButton = (
    <Pressable onPress={() => router.back()} style={styles.backButton}>
      <Text style={[styles.backButtonText, { color: textColor }]}>Retour</Text>
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => backButton,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => backButton,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => backButton,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
