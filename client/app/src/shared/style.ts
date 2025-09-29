import { StyleSheet } from 'react-native';

export const global_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center' as const, 
    alignItems: 'center' as const,     // Add 'as const' for TypeScript
    padding: 16,
    backgroundColor: 'rgb(252,244,249)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 20,
  },
});