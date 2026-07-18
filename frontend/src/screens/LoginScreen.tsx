import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.198:8080/api/v1';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telephone: phone, motDePasse: password })
      });
      
      if (response.ok) {
        const data = await response.json();
        const user = {
          id: data.utilisateur.id,
          token: data.token,
          refreshToken: data.refreshToken,
          name: `${data.utilisateur.nom} ${data.utilisateur.prenom}`,
          phone: data.utilisateur.telephone || phone,
          email: data.utilisateur.email,
          quartier: data.utilisateur.zone ? data.utilisateur.zone.nom : 'Inconnu',
          role: typeof data.utilisateur.role === 'string' ? data.utilisateur.role : data.utilisateur.role?.nom,
          pmeId: data.utilisateur.pmeAppartenance ? data.utilisateur.pmeAppartenance.id : null
        };
        await AsyncStorage.setItem('loggedUser', JSON.stringify(user));
        
        // Redirection Dynamique selon le r'le
        if (user.role === 'ADMIN' || user.role === 'GERANT_PME') {
          navigation.replace('HomeAdmin');
        } else if (user.role === 'AGENT' || user.role === 'COLLECTEUR') {
          navigation.replace('HomeAgent');
        } else {
          // MENAGE : va directement sur son espace
          navigation.replace('HomeMenage');
        }
      } else {
        const errData = await response.json().catch(() => null);
        const msg = errData?.error || "Identifiants incorrects ou compte inexistant.";
        Alert.alert("Erreur", msg);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Bouton Retour */}
      <TouchableOpacity style={styles.headerBackButton} onPress={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace('Welcome');
        }
      }}>
        <Text style={styles.headerBackButtonText}>{'<'} Accueil</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, marginTop: 40 }}>
        <ScrollView contentContainerStyle={styles.loginScrollContainer} showsVerticalScrollIndicator={false}>
          


          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>{'♻️'}</Text>
            <Text style={styles.logoText}>GN-Dechet</Text>
            <Text style={styles.logoTagline}>L'assainissement intelligent</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Connexion</Text>
            
            <Text style={styles.inputLabel}>Numero de telephone</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ex: 622458812" 
              placeholderTextColor="#A0A0A0" 
              keyboardType="phone-pad" 
              value={phone} 
              onChangeText={setPhone} 
            />
            
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput 
              style={styles.input} 
              placeholder="........" 
              placeholderTextColor="#A0A0A0" 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword} 
            />
            
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchScreenContainer}>
              <Text style={styles.switchScreenText}>Nouveau sur l'application ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.switchScreenLink}> Creer un compte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loginScrollContainer: { flexGrow: 1, padding: 24, paddingBottom: 50 },
  headerBackButton: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 20 },
  headerBackButtonText: { color: '#00c896', fontSize: 16, fontWeight: '700' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { fontSize: 60, marginBottom: 10 },
  logoText: { fontSize: 28, fontWeight: '800', color: '#1B5E20' },
  logoTagline: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  formContainer: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 15, 
    elevation: 5 
  },
  loginTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 24, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { 
    backgroundColor: '#F1F3F5', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#E9ECEF' 
  },
  primaryButton: { 
    backgroundColor: '#00c896', 
    borderRadius: 12, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginTop: 8, 
    shadowColor: '#00c896', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 4 
  },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  switchScreenContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchScreenText: { color: '#666', fontSize: 14 },
  switchScreenLink: { color: '#00c896', fontSize: 14, fontWeight: '700' },
});
