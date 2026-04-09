import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { profileStyles } from './profile.styles';

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

  const webPageStyle =
    Platform.OS === 'web' ? { backgroundImage: `var(--${theme === 'dark' ? 'd' : 'l'}-bg-color)` } : null;
  const infoLabelColor = theme === 'dark' ? 'rgba(240, 240, 240, 0.7)' : 'rgba(0, 32, 64, 0.7)';
  const statBorderColor = theme === 'dark' ? 'rgba(240, 240, 240, 0.12)' : 'rgba(0, 32, 64, 0.12)';
  const statScoreColor = theme === 'dark' ? '#FFFFFF' : '#001A33';
  const profileCardStyle = { backgroundColor: palette.surface };
  const profileLogoutButtonStyle = { backgroundColor: palette.primary };
  const contentContainerStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  } as const;

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
      <View style={[profileStyles.page, profileStyles.loadingContainer, { backgroundColor: palette.bg }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!currentUser) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      style={[profileStyles.page, { backgroundColor: palette.bg }, webPageStyle]}>
      <View style={[profileStyles.card, profileCardStyle]}>
        <ThemedText type="title">Page de Profil</ThemedText>

        <View style={profileStyles.section}>
          <ThemedText type="subtitle">Informations personnelles</ThemedText>

          <View style={profileStyles.fieldGroup}>
            <ThemedText style={[profileStyles.infoLabel, { color: infoLabelColor }]}>
              Nom
            </ThemedText>
            <ThemedText type="subtitle" style={[profileStyles.nameLabel, { color: palette.text }]}>
              {name}
            </ThemedText>
          </View>

          <View style={profileStyles.fieldGroup}>
            <ThemedText style={[profileStyles.infoLabel, { color: infoLabelColor }]}>
              Adresse e-mail
            </ThemedText>
            <ThemedText type="subtitle" style={[profileStyles.nameLabel, { color: palette.text }]}>
              {email}
            </ThemedText>
          </View>
        </View>

        <View style={profileStyles.section}>
          <ThemedText type="subtitle">Statistique</ThemedText>

          {questionnaireScores.map((score, index) => (
            <View
              key={`questionnaire-${index + 1}`}
              style={[profileStyles.statRow, { borderBottomColor: statBorderColor }]}>
              <ThemedText style={profileStyles.fieldLabel}>{`Questionnaire ${index + 1}`}</ThemedText>
              <ThemedText type="defaultSemiBold" style={[profileStyles.statScore, { color: statScoreColor }]}>
                {score}%
              </ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [profileStyles.logoutButton, profileLogoutButtonStyle, pressed ? profileStyles.pressed : null]}>
          <ThemedText type="defaultSemiBold" style={profileStyles.buttonText}>
            Déconnexion
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

