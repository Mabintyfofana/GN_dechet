import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Cercles decoratifs en fond */}
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      <View style={styles.content}>
        {/* Bouton Accès Admin en haut à droite */}
        <TouchableOpacity 
          style={styles.adminBadge}
          onPress={() => Linking.openURL('http://192.168.1.198:5173')}
          activeOpacity={0.7}
        >
          <Text style={styles.adminBadgeText}>{'⚙️'} Accès Admin / Gérant</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.emoji}>{'🌿'}</Text>
          <Text style={styles.title}>GN-Dechet</Text>
          <Text style={styles.subtitle}>Un environnement propre, une nation saine.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcomeText}>
            Bienvenue sur le reseau unifie de gestion des dechets de Conakry.
          </Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Se Connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Creer un compte</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Conakry - Guinee Numerique</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  circleTop: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: '#00c896',
    top: -width * 0.5,
    left: -width * 0.2,
  },
  circleBottom: {
    width: width,
    height: width,
    backgroundColor: '#3b82f6',
    bottom: -width * 0.4,
    right: -width * 0.2,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emoji: {
    fontSize: 70,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#00c896',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  welcomeText: {
    color: '#e2e8f0',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#00c896',
    shadowColor: '#00c896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1e2d45',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    color: '#475569',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  adminBadge: {
    position: 'absolute',
    top: 20,
    right: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminBadgeText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  }
});
