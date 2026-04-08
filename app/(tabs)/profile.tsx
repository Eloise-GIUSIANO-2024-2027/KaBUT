import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
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
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];

  const [name, setName] = useState('Nom');
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState('Nom');
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
      </View>
    </ScrollView>
  );
}




