import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

interface RegisterScreenProps {
  navigation: any;
}

const API_URL = 'http://192.168.1.198:8080/api/v1';

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'MENAGE' | 'AGENT'>('MENAGE');
  const [regPhone, setRegPhone] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regQuartier, setRegQuartier] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSpecialisation, setRegSpecialisation] = useState('PLASTIQUE');
  
  const [pmes, setPmes] = useState<any[]>([]);
  const [selectedPme, setSelectedPme] = useState<string>('');

  useEffect(() => {
    fetch(`${API_URL}/pme`)
      .then(res => res.json())
      .then(data => {
        setPmes(data);
      })
      .catch(err => console.error("Erreur chargement PMEs:", err));
  }, [API_URL]);

  const handleRegister = async () => {
    if (!regPhone || !regPassword || !regConfirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir les champs obligatoires.");
      return;
    }
    if (selectedRole === 'MENAGE' && (!regFullName || !regQuartier)) {
      Alert.alert("Erreur", "Veuillez renseigner votre nom et votre quartier.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const nom = selectedRole === 'MENAGE' ? regFullName.split(' ')[0] : 'Agent';
      const prenom = selectedRole === 'MENAGE' ? regFullName.substring(nom.length).trim() : 'Officiel';
      const email = `${regPhone}@gndechet.gn`;
      
      const response = await fetch(`${API_URL}/auth/inscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom,
          prenom: prenom || nom,
          email: email,
          motDePasse: regPassword,
          role: selectedRole,
          zoneId: 1,
          telephone: regPhone,
          specialisation: selectedRole === 'AGENT' ? regSpecialisation : 'NON_APPLICABLE',
          pmeId: ((selectedRole === 'MENAGE' || (selectedRole === 'AGENT' && regSpecialisation === 'ORDINAIRE')) && selectedPme !== '') ? selectedPme : undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.token && data.refreshToken) {
          const user = {
            id: data.utilisateur.id,
            token: data.token,
            refreshToken: data.refreshToken,
            name: `${data.utilisateur.nom} ${data.utilisateur.prenom}`,
            phone: regPhone,
            email: data.utilisateur.email,
            quartier: data.utilisateur.zone ? data.utilisateur.zone.nom : 'Inconnu',
            role: typeof data.utilisateur.role === 'string' ? data.utilisateur.role : data.utilisateur.role?.nom
          };
          await AsyncStorage.setItem('loggedUser', JSON.stringify(user));
          if (user.role === 'AGENT' || user.role === 'COLLECTEUR') {
            navigation.replace('HomeAgent');
          } else {
            navigation.replace('HomeMenage');
          }
        } else {
          Alert.alert("Succes", "Compte cree ! Veuillez vous connecter.");
          navigation.navigate('Login');
        }
      } else {
        Alert.alert("Erreur", "Echec de l'inscription.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
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
            <Text style={styles.logoText}>GN Dechet</Text>
            <Text style={styles.logoTagline}>Le lien direct entre menages et collecteurs en tricycle</Text>
            <View style={styles.switchScreenContainer}>
              <Text style={styles.switchScreenText}>Vous avez deja un compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchScreenLink}> Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Creer un compte</Text>
            
            <View style={styles.roleSelectorContainer}>
              <TouchableOpacity style={[styles.roleTab, selectedRole === 'MENAGE' && styles.roleTabActive]} onPress={() => setSelectedRole('MENAGE')}>
                <Text style={[styles.roleTabText, selectedRole === 'MENAGE' && styles.roleTabTextActive]}>🏠 Menage</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleTab, selectedRole === 'AGENT' && styles.roleTabActive]} onPress={() => setSelectedRole('AGENT')}>
                <Text style={[styles.roleTabText, selectedRole === 'AGENT' && styles.roleTabTextActive]}>👷 Agent Tricycle</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Numero de telephone *</Text>
            <TextInput style={styles.input} placeholder="Ex: 622458812" placeholderTextColor="#A0A0A0" keyboardType="phone-pad" value={regPhone} onChangeText={setRegPhone} />
            
            {selectedRole === 'MENAGE' && (
              <>
                <Text style={styles.inputLabel}>Nom Complet *</Text>
                <TextInput style={styles.input} placeholder="Ex: Mabinty Fofana" value={regFullName} onChangeText={setRegFullName} />
                <Text style={styles.inputLabel}>Quartier (Zone) *</Text>
                <TextInput style={styles.input} placeholder="Ex: Kaloum, Almamya" value={regQuartier} onChangeText={setRegQuartier} />
                
                <Text style={styles.inputLabel}>Votre PME de ramassage</Text>
                <View style={{borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: '#F8F9FA', marginBottom: 15}}>
                  <Picker selectedValue={selectedPme} onValueChange={(itemValue) => setSelectedPme(itemValue)}>
                    <Picker.Item label="Selectionnez une PME (Optionnel)" value="" />
                    {pmes.map(pme => <Picker.Item key={pme.id} label={pme.nom} value={pme.id} />)}
                  </Picker>
                </View>
                
                {selectedPme ? (() => {
                  const pme = pmes.find(p => p.id === selectedPme);
                  return pme ? (
                    <View style={{padding: 12, backgroundColor: '#E8F5E9', borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#C8E6C9'}}>
                      <Text style={{fontWeight: 'bold', color: '#2E7D32'}}>🏢 Informations sur l'entreprise</Text>
                      {pme.description ? <Text style={{fontSize: 13, color: '#424242', marginTop: 6}}>{pme.description}</Text> : null}
                      <Text style={{fontSize: 13, color: '#424242', marginTop: 6}}>📄 Zone couverte : {pme.zoneCouverture || 'Non specifiee'}</Text>
                      <Text style={{fontSize: 13, color: '#424242', marginTop: 6}}>🚚 {pme.telephone || 'Non renseigne'}</Text>
                      <Text style={{fontSize: 13, color: '#2E7D32', marginTop: 6, fontWeight: 'bold'}}>Tarif d'abonnement : {pme.tarifMensuel ? `${pme.tarifMensuel} GNF / mois` : '✅ definir avec la PME'}</Text>
                    </View>
                  ) : null;
                })() : null}
              </>
            )}

            {selectedRole === 'AGENT' && (
              <>
                <Text style={styles.inputLabel}>Votre specialisation *</Text>
                <View style={{flexDirection: 'column', gap: 10, marginBottom: 15}}>
                  <TouchableOpacity 
                    style={{padding: 10, borderWidth: 1, borderColor: regSpecialisation === 'PLASTIQUE' ? '#0288D1' : '#E0E0E0', borderRadius: 8, backgroundColor: regSpecialisation === 'PLASTIQUE' ? '#E1F5FE' : '#FFFFFF'}}
                    onPress={() => setRegSpecialisation('PLASTIQUE')}
                  >
                    <Text style={{fontWeight: 'bold', color: regSpecialisation === 'PLASTIQUE' ? '#0288D1' : '#757575'}}>♻️ Membre Cooperative Plastique</Text>
                    <Text style={{fontSize: 12, color: '#757575', marginTop: 4}}>Je possede le monopole exclusif sur la collecte du plastique recyclable a Conakry.</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{padding: 10, borderWidth: 1, borderColor: regSpecialisation === 'ORDINAIRE' ? '#2E7D32' : '#E0E0E0', borderRadius: 8, backgroundColor: regSpecialisation === 'ORDINAIRE' ? '#E8F5E9' : '#FFFFFF'}}
                    onPress={() => setRegSpecialisation('ORDINAIRE')}
                  >
                    <Text style={{fontWeight: 'bold', color: regSpecialisation === 'ORDINAIRE' ? '#2E7D32' : '#757575'}}>🗑️ PME ou Independant (Ordures Menageres)</Text>
                    <Text style={{fontSize: 12, color: '#757575', marginTop: 4}}>Je collecte les autres dechets (cuisine, balayage, etc.) pour les menages abonnes.</Text>
                  </TouchableOpacity>
                </View>
                {regSpecialisation === 'ORDINAIRE' && (
                  <>
                    <Text style={styles.inputLabel}>ID de votre PME d'affiliation *</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Collez l'ID fourni par votre gerant..." 
                      value={selectedPme} 
                      onChangeText={setSelectedPme} 
                    />

                    {selectedPme ? (() => {
                      const pme = pmes.find(p => p.id === selectedPme);
                      return pme ? (
                        <View style={{padding: 12, backgroundColor: '#E8F5E9', borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#C8E6C9'}}>
                          <Text style={{fontWeight: 'bold', color: '#2E7D32'}}>🏢 Informations sur l'entreprise</Text>
                          {pme.description ? <Text style={{fontSize: 13, color: '#424242', marginTop: 6}}>{pme.description}</Text> : null}
                          <Text style={{fontSize: 13, color: '#424242', marginTop: 6}}>📄 Zone couverte : {pme.zoneCouverture || 'Non specifiee'}</Text>
                          <Text style={{fontSize: 13, color: '#424242', marginTop: 6}}>🚚 {pme.telephone || 'Non renseigne'}</Text>
                        </View>
                      ) : null;
                    })() : null}
                  </>
                )}
              </>
            )}

            <Text style={styles.inputLabel}>Mot de passe *</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#A0A0A0" secureTextEntry value={regPassword} onChangeText={setRegPassword} />
            <Text style={styles.inputLabel}>Confirmer le mot de passe *</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#A0A0A0" secureTextEntry value={regConfirmPassword} onChangeText={setRegConfirmPassword} />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.loginButtonText}>Creer mon compte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerLinkText}>Deja inscrit ? <Text style={{fontWeight: 'bold', color: '#2E7D32'}}>Se connecter</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerBackButton: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 20 },
  headerBackButtonText: { color: '#00c896', fontSize: 16, fontWeight: '700' },
  loginScrollContainer: { flexGrow: 1, padding: 24, paddingBottom: 50 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { fontSize: 60, marginBottom: 10 },
  logoText: { fontSize: 28, fontWeight: '800', color: '#1B5E20' },
  logoTagline: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 20 },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5 },
  loginTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 24, textAlign: 'center' },
  roleSelectorContainer: { flexDirection: 'row', backgroundColor: '#F1F3F5', borderRadius: 12, padding: 4, marginBottom: 24 },
  roleTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  roleTabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  roleTabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  roleTabTextActive: { color: '#2E7D32', fontWeight: '700' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#F1F3F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#333', marginBottom: 20, borderWidth: 1, borderColor: '#E9ECEF' },
  registerButton: { backgroundColor: '#2E7D32', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  loginButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  registerLink: { marginTop: 24, alignItems: 'center' },
  registerLinkText: { color: '#666', fontSize: 14 },
  switchScreenContainer: { marginTop: 15, flexDirection: 'row', justifyContent: 'center' },
  switchScreenText: { color: '#666', fontSize: 14 },
  switchScreenLink: { color: '#2E7D32', fontSize: 14, fontWeight: 'bold' },
});
