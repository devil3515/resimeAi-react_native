import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>AI</Text>
        </View>
        <Text style={styles.appName}>ResumeAI</Text>
        <Text style={styles.tagline}>Smart Resume Analysis & Optimization</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.onPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.onPrimary,
    opacity: 0.8,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  footer: {
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: theme.colors.onPrimary,
    opacity: 0.6,
  },
});

export default SplashScreen;
