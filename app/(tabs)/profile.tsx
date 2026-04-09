import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {useAuth} from "@/hooks/use-auth";

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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  nameLabel: {
    flex: 1,
  },
  nameInput: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  nameButton: {
    minWidth: 120,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  section: {
    gap: 12,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  validateButton: {
    alignSelf: 'flex-start',
    minWidth: 140,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 4,
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState('Nom');
  const [email, setEmail] = useState('Adresse mail');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [draftEmail, setDraftEmail] = useState('Adresse mail');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const questionnaireScores = useMemo(
    () => [randomScore(), randomScore(), randomScore(), randomScore()],
    []
  );

  const webPageStyle = Platform.OS === 'web' ? { backgroundImage: `var(--${theme === 'dark' ? 'd' : 'l'}-bg-color)` } : null;
  const inputBaseStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 32, 64, 0.14)',
    color: palette.text,
  } as const;
  const placeholderTextColor = theme === 'dark' ? 'rgba(240, 240, 240, 0.55)' : 'rgba(0, 32, 64, 0.45)';
  const statBorderColor = theme === 'dark' ? 'rgba(240, 240, 240, 0.12)' : 'rgba(0, 32, 64, 0.12)';

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const nextName = currentUser.name || 'Nom';
    const nextEmail = currentUser.email || 'Adresse mail';

    setName(nextName);
    setDraftName(nextName);
    setEmail(nextEmail);
    setDraftEmail(nextEmail);
  }, [currentUser]);

  const toggleNameEditing = () => {
    if (isEditingName) {
      const nextName = draftName.trim() || 'Nom';
      setName(nextName);
      setDraftName(nextName);
      setIsEditingName(false);
      return;
    }

    setDraftName(name);
    setIsEditingName(true);
  };

  const toggleEmailEditing = () => {
    if (isEditingEmail) {
      const nextEmail = draftEmail.trim() || 'Adresse mail';
      setEmail(nextEmail);
      setDraftEmail(nextEmail);
      setIsEditingEmail(false);
      return;
    }

    setDraftEmail(email);
    setIsEditingEmail(true);
  };

  const handlePasswordValidation = () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Changer mot de passe', 'Merci de remplir tous les champs.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Changer mot de passe', 'Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    Alert.alert('Changer mot de passe', 'Le mot de passe a été mis à jour localement.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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

        <View style={profileNativeStyles.nameRow}>
          {isEditingName ? (
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Nom"
              placeholderTextColor={placeholderTextColor}
              style={[profileNativeStyles.nameInput, inputBaseStyle]}
              selectionColor={palette.primary}
              returnKeyType="done"
            />
          ) : (
            <ThemedText type="subtitle" style={[profileNativeStyles.nameLabel, { color: palette.text }]}>
              {name}
            </ThemedText>
          )}

          <Pressable
            onPress={toggleNameEditing}
            style={({ pressed }) => [
              profileNativeStyles.nameButton,
              { backgroundColor: palette.primary },
              pressed ? profileNativeStyles.pressed : null,
            ]}>
            <ThemedText type="defaultSemiBold" style={profileNativeStyles.buttonText}>
              {isEditingName ? 'Enregistrer' : 'Modifier'}
            </ThemedText>
          </Pressable>
        </View>

        <View style={profileNativeStyles.nameRow}>
          {isEditingEmail ? (
            <TextInput
              value={draftEmail}
              onChangeText={setDraftEmail}
              placeholder="Adresse mail"
              placeholderTextColor={placeholderTextColor}
              style={[profileNativeStyles.nameInput, inputBaseStyle]}
              selectionColor={palette.primary}
              returnKeyType="done"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <ThemedText type="subtitle" style={[profileNativeStyles.nameLabel, { color: palette.text }]}>
              {email}
            </ThemedText>
          )}

          <Pressable
            onPress={toggleEmailEditing}
            style={({ pressed }) => [
              profileNativeStyles.nameButton,
              { backgroundColor: palette.primary },
              pressed ? profileNativeStyles.pressed : null,
            ]}>
            <ThemedText type="defaultSemiBold" style={profileNativeStyles.buttonText}>
              {isEditingEmail ? 'Enregistrer' : 'Modifier'}
            </ThemedText>
          </Pressable>
        </View>

        <View style={profileNativeStyles.section}>
          <ThemedText type="subtitle">Changer mot de passe</ThemedText>

          <View style={profileNativeStyles.fieldGroup}>
            <ThemedText style={profileNativeStyles.fieldLabel}>Entrer l&apos;ancien mot de passe</ThemedText>
            <TextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              placeholder="Ancien mot de passe"
              placeholderTextColor={placeholderTextColor}
              style={[profileNativeStyles.input, inputBaseStyle]}
              selectionColor={palette.primary}
            />
          </View>

          <View style={profileNativeStyles.fieldGroup}>
            <ThemedText style={profileNativeStyles.fieldLabel}>Entrer le nouveau mot de passe</ThemedText>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Nouveau mot de passe"
              placeholderTextColor={placeholderTextColor}
              style={[profileNativeStyles.input, inputBaseStyle]}
              selectionColor={palette.primary}
            />
          </View>

          <View style={profileNativeStyles.fieldGroup}>
            <ThemedText style={profileNativeStyles.fieldLabel}>Confirmer le nouveau mot de passe</ThemedText>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={placeholderTextColor}
              style={[profileNativeStyles.input, inputBaseStyle]}
              selectionColor={palette.primary}
            />
          </View>

          <Pressable
            onPress={handlePasswordValidation}
            style={({ pressed }) => [
              profileNativeStyles.validateButton,
              { backgroundColor: palette.secondary },
              pressed ? profileNativeStyles.pressed : null,
            ]}>
            <ThemedText type="defaultSemiBold" style={profileNativeStyles.buttonText}>
              Valider
            </ThemedText>
          </Pressable>
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
              <ThemedText type="defaultSemiBold" style={[profileNativeStyles.statScore, { color: palette.primary }]}>
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




