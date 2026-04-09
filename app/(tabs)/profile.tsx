import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';

const profileNativeStyles = StyleSheet.create({
  page: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 640,
    borderRadius: 20,
    padding: 24,
    gap: 24,
  },
  nameLabel: {
    fontSize: 18,
    lineHeight: 26,
  },
  section: {
    gap: 12,
  },
  fieldGroup: {
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  logoutButton: {
    alignSelf: 'stretch',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  statScore: {
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});

function randomScore() {
  return Math.floor(Math.random() * 101);
}

export default function ProfilePage() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];
  const { currentUser, isLoading, logout } = useAuth();

  const [name, setName] = useState('Nom');
  const [email, setEmail] = useState('Adresse mail');

  const questionnaireScores = useMemo(
    () => [randomScore(), randomScore(), randomScore(), randomScore()],
    []
  );

  const webPageStyle = Platform.OS === 'web' ? { backgroundImage: `var(--${theme === 'dark' ? 'd' : 'l'}-bg-color)` } : null;
  const infoLabelColor = theme === 'dark' ? 'rgba(240, 240, 240, 0.7)' : 'rgba(0, 32, 64, 0.7)';
  const statBorderColor = theme === 'dark' ? 'rgba(240, 240, 240, 0.12)' : 'rgba(0, 32, 64, 0.12)';
  const statScoreColor = theme === 'dark' ? '#FFFFFF' : '#001A33';

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const nextName = currentUser.name || 'Nom';
    const nextEmail = currentUser.email || 'Adresse mail';

    setName(nextName);
    setEmail(nextEmail);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace('/');
    }
  };

  if (isLoading) {
    return (
      <View style={[profileNativeStyles.page, profileNativeStyles.loadingContainer, { backgroundColor: palette.bg }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!currentUser) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView
      contentContainerStyle={profileNativeStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      style={[profileNativeStyles.page, { backgroundColor: palette.bg }, webPageStyle]}>
      <View style={[profileNativeStyles.card, { backgroundColor: palette.surface }]}>
        <ThemedText type="title">Page de Profil</ThemedText>

        <View style={profileNativeStyles.section}>
          <ThemedText type="subtitle">Informations personnelles</ThemedText>

          <View style={profileNativeStyles.fieldGroup}>
            <ThemedText style={[profileNativeStyles.infoLabel, { color: infoLabelColor }]}>Nom</ThemedText>
            <ThemedText type="subtitle" style={[profileNativeStyles.nameLabel, { color: palette.text }]}> 
              {name}
            </ThemedText>
          </View>

          <View style={profileNativeStyles.fieldGroup}>
            <ThemedText style={[profileNativeStyles.infoLabel, { color: infoLabelColor }]}>Adresse e-mail</ThemedText>
            <ThemedText type="subtitle" style={[profileNativeStyles.nameLabel, { color: palette.text }]}> 
              {email}
            </ThemedText>
          </View>
        </View>

        <View style={profileNativeStyles.section}>
          <ThemedText type="subtitle">Statistique</ThemedText>

          {questionnaireScores.map((score, index) => (
            <View
              key={`questionnaire-${index + 1}`}
              style={[
                profileNativeStyles.statRow,
                {
                  borderBottomColor: statBorderColor,
                },
              ]}>
              <ThemedText style={profileNativeStyles.fieldLabel}>{`Questionnaire ${index + 1}`}</ThemedText>
              <ThemedText type="defaultSemiBold" style={[profileNativeStyles.statScore, { color: statScoreColor }]}> 
                {score}%
              </ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            profileNativeStyles.logoutButton,
            { backgroundColor: palette.primary },
            pressed ? profileNativeStyles.pressed : null,
          ]}>
          <ThemedText type="defaultSemiBold" style={profileNativeStyles.buttonText}>
            Déconnexion
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}




