import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
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
  nameLabel: {
    fontSize: 18,
    lineHeight: 26,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 24,
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
    fontWeight: '800' as const,
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
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});

