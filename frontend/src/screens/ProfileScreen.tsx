import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, ScrollView, StatusBar, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileScreenProps {
  navigation: any;
}

const API_URL = 'http://192.168.1.198:8080/api/v1';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [loggedUser, setLoggedUser] = useState<any>({});

  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regQuartier, setRegQuartier] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('loggedUser').then(val => {
      if(val) {
        const user = JSON.parse(val);
        setLoggedUser(user);
        setRegFullName(user.name || '');
        setRegPhone(user.phone || '');
        setRegQuartier(user.quartier || '');
      }
    });
  }, []);

  const handleSaveProfile = async () => {
    if (!regFullName.trim() || !regPhone.trim()) {
      Alert.alert("Erreur", "Le nom et le telephone sont obligatoires.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/utilisateurs/profil`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: JSON.stringify({
          nom: regFullName.trim(),
          telephone: regPhone.trim(),
          quartier: loggedUser.role === 'MENAGE' ? regQuartier.trim() : undefined
        })
      });

      if (response.ok) {
        const updatedUser = {
          ...loggedUser,
          name: regFullName.trim(),
          phone: regPhone.trim(),
          quartier: loggedUser.role === 'MENAGE' ? regQuartier.trim() : loggedUser.quartier
        };
        await AsyncStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        setLoggedUser(updatedUser);
        Alert.alert("Succes", "Vos coordonnees ont ete mises a jour !");
        if (navigation.canGoBack()) navigation.goBack(); else navigation.navigate('Welcome');
      } else {
        const errData = await response.json().catch(() => null);
        const msg = errData?.error || "Echec de la mise a jour.";
        if (response.status === 401 || response.status === 403) {
          await AsyncStorage.removeItem('loggedUser');
          navigation.replace('Login');
          return;
        }
        Alert.alert("Erreur", msg);
      }
    } catch (error) {
      console.error("Erreur mise a jour profil:", error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { if (navigation.canGoBack()) navigation.goBack(); else navigation.navigate('Welcome'); }} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'} Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{'⚙️'} Mettre a jour mes coordonnees</Text>
          <Text style={styles.sectionSubtitle}>
            Ces informations permettent de vous joindre facilement sur le terrain.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.inputLabel}>Nom complet affiche *</Text>
          <TextInput
            style={styles.input}
            value={regFullName}
            onChangeText={setRegFullName}
            placeholder="Ex: Mabinty Fofana"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.inputLabel}>Numero de telephone *</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={regPhone}
            onChangeText={setRegPhone}
            placeholder="Ex: 622458812"
            placeholderTextColor="#A0A0A0"
          />

          {loggedUser.role === 'MENAGE' && (
            <>
              <Text style={styles.inputLabel}>Quartier de residence</Text>
              <TextInput
                style={styles.input}
                value={regQuartier}
                onChangeText={setRegQuartier}
                placeholder="Ex: Kaloum, Almamya"
                placeholderTextColor="#A0A0A0"
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>{' '} Enregistrer</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => { if (navigation.canGoBack()) navigation.goBack(); else navigation.navigate('Welcome'); }}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24, paddingTop: 10
  },
  backButton: { paddingVertical: 6, paddingHorizontal: 4 },
  backButtonText: { color: '#2E7D32', fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  formContainer: {
    backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 15, elevation: 5
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#2E7D32', marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 20 },
  inputLabel: {
    fontSize: 12, fontWeight: '700', color: '#555',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5
  },
  input: {
    backgroundColor: '#F1F3F5', borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15, color: '#333', marginBottom: 18,
    borderWidth: 1, borderColor: '#E9ECEF'
  },
  saveButton: {
    backgroundColor: '#2E7D32', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  saveButtonDisabled: { backgroundColor: '#A5D6A7', elevation: 0 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelButton: {
    paddingVertical: 16, alignItems: 'center', marginTop: 12
  },
  cancelButtonText: { color: '#757575', fontSize: 15, fontWeight: '600' }
});
