import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getProfileInputBaseStyle,
  getProfilePlaceholderColor,
  getProfileStatBorderColor,
  getProfileWebPageStyle,
  profileStyles,
} from './profile.styles';

function randomScore() {
  return Math.floor(Math.random() * 101);
}

export default function ProfilePage() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];
  const { currentUser, isLoading, logoutCurrentUser } = useCurrentUser();

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

  const webPageStyle = getProfileWebPageStyle(theme);
  const inputBaseStyle = getProfileInputBaseStyle(theme, palette.text);
  const placeholderTextColor = getProfilePlaceholderColor(theme);
  const statBorderColor = getProfileStatBorderColor(theme);

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
      await logoutCurrentUser();
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
      contentContainerStyle={profileStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      style={[profileStyles.page, { backgroundColor: palette.bg }, webPageStyle]}>
      <View style={[profileStyles.card, { backgroundColor: palette.surface }]}>
        <ThemedText type="title">Page de Profil</ThemedText>

        <View style={profileStyles.nameRow}>
          {isEditingName ? (
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Nom"
              placeholderTextColor={placeholderTextColor}
              style={[profileStyles.nameInput, inputBaseStyle]}
              selectionColor={palette.primary}
              returnKeyType="done"
            />
          ) : (
            <ThemedText type="subtitle" style={[profileStyles.nameLabel, { color: palette.text }]}>
              {name}
            </ThemedText>
          )}

          <Pressable
            onPress={toggleNameEditing}
            style={({ pressed }) => [
              profileStyles.nameButton,
              { backgroundColor: palette.primary },
              pressed ? profileStyles.pressed : null,
            ]}>
            <ThemedText type="defaultSemiBold" style={profileStyles.buttonText}>
              {isEditingName ? 'Enregistrer' : 'Modifier'}
            </ThemedText>
          </Pressable>
        </View>

        <View style={profileStyles.nameRow}>
          {isEditingEmail ? (
            <TextInput
              value={draftEmail}
              onChangeText={setDraftEmail}
              placeholder="Adresse mail"
              placeholderTextColor={placeholderTextColor}
              style={[profileStyles.nameInput, inputBaseStyle]}
              selectionColor={palette.primary}
              returnKeyType="done"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <ThemedText type="subtitle" style={[profileStyles.nameLabel, { color: palette.text }]}>
              {email}
            </ThemedText>
          )}

          <Pressable
            onPress={toggleEmailEditing}
            style={({ pressed }) => [
              profileStyles.nameButton,
              { backgroundColor: palette.primary },
              pressed ? profileStyles.pressed : null,
            ]}>
            <ThemedText type="defaultSemiBold" style={profileStyles.buttonText}>
              {isEditingEmail ? 'Enregistrer' : 'Modifier'}
            </ThemedText>
          </Pressable>
        </View>

        <View style={profileStyles.section}>
          <ThemedText type="subtitle">Changer mot de passe</ThemedText>

          <View style={profileStyles.fieldGroup}>
            <ThemedText style={profileStyles.fieldLabel}>Entrer l&apos;ancien mot de passe</ThemedText>
            <TextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              placeholder="Ancien mot de passe"
              placeholderTextColor={placeholderTextColor}
              style={[profileStyles.input, inputBaseStyle]}
              selectionColor={palette.primary}
            />
          </View>

          <View style={profileStyles.fieldGroup}>
            <ThemedText style={profileStyles.fieldLabel}>Entrer le nouveau mot de passe</ThemedText>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Nouveau mot de passe"
              placeholderTextColor={placeholderTextColor}
              style={[profileStyles.input, inputBaseStyle]}
              selectionColor={palette.primary}
            />
          </View>

          <View style={profileStyles.fieldGroup}>
            <ThemedText style={profileStyles.fieldLabel}>Confirmer le nouveau mot de passe</ThemedText>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={placeholderTextColor}
              style={[profileStyles.input, inputBaseStyle]}
              selectionColor={palette.primary}
            />
          </View>

          <Pressable
            onPress={handlePasswordValidation}
            style={({ pressed }) => [
              profileStyles.validateButton,
              { backgroundColor: palette.secondary },
              pressed ? profileStyles.pressed : null,
            ]}>
            <ThemedText type="defaultSemiBold" style={profileStyles.buttonText}>
              Valider
            </ThemedText>
          </Pressable>
        </View>

        <View style={profileStyles.section}>
          <ThemedText type="subtitle">Statistique</ThemedText>

          {questionnaireScores.map((score, index) => (
            <View
              key={`questionnaire-${index + 1}`}
              style={[
                profileStyles.statRow,
                {
                  borderBottomColor: statBorderColor,
                },
              ]}>
              <ThemedText style={profileStyles.fieldLabel}>{`Questionnaire ${index + 1}`}</ThemedText>
              <ThemedText type="defaultSemiBold" style={[profileStyles.statScore, { color: palette.primary }]}>
                {score}%
              </ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            profileStyles.logoutButton,
            { backgroundColor: palette.primary },
            pressed ? profileStyles.pressed : null,
          ]}>
          <ThemedText type="defaultSemiBold" style={profileStyles.buttonText}>
            Déconnexion
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}




