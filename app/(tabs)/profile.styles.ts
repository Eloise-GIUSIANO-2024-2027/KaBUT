import { Platform, StyleSheet } from 'react-native';

import { Colors, UiTokens } from '@/constants/theme';

type ThemeName = keyof typeof Colors;

export const profileStyles = StyleSheet.create({
  page: {
    flex: 1,
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
    borderRadius: UiTokens.radiusDefault,
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
    borderRadius: UiTokens.radiusButton,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  nameButton: {
    minWidth: 120,
    borderRadius: UiTokens.radiusButton,
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
    borderRadius: UiTokens.radiusButton,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  validateButton: {
    alignSelf: 'flex-start',
    minWidth: 140,
    borderRadius: UiTokens.radiusButton,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 4,
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

export function getProfileWebPageStyle(theme: ThemeName) {
  if (Platform.OS !== 'web') {
    return null;
  }

  const prefix = theme === 'dark' ? 'd' : 'l';
  return {
    backgroundImage: `var(--${prefix}-bg-color)`,
  } as const;
}

export function getProfileInputBaseStyle(theme: ThemeName, textColor: string) {
  return {
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 32, 64, 0.14)',
    color: textColor,
  } as const;
}

export function getProfilePlaceholderColor(theme: ThemeName) {
  return theme === 'dark' ? 'rgba(240, 240, 240, 0.55)' : 'rgba(0, 32, 64, 0.45)';
}

export function getProfileStatBorderColor(theme: ThemeName) {
  return theme === 'dark' ? 'rgba(240, 240, 240, 0.12)' : 'rgba(0, 32, 64, 0.12)';
}

