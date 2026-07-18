import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../utils/apiFetch';

interface HomePmeScreenProps {
  navigation: any;
}

const API_URL = 'http://192.168.1.198:8080/api/v1';

export default function HomePmeScreen({ navigation }: HomePmeScreenProps) {
  const [loggedUser, setLoggedUser] = useState<any>({});
  const [pendingAgents, setPendingAgents] = useState<any[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('loggedUser').then(val => {
      if (val) setLoggedUser(JSON.parse(val));
    });
  }, []);

  useEffect(() => {
    if (loggedUser.token) fetchPendingAgents();
  }, [loggedUser.token]);

  const fetchPendingAgents = async () => {
    if (!loggedUser.pmeId) return;
    try {
      const response = await apiFetch(`${API_URL}/pme/${loggedUser.pmeId}/agents-en-attente`, {
        headers: { 'Authorization': `Bearer ${loggedUser.token}` }
      }, handleSessionExpired);
      if (response.ok) {
        const data = await response.json();
        setPendingAgents(data);
      }
    } catch (error) {
      console.error('Erreur fetchPendingAgents', error);
    }
  };

  const handleValidateAgent = async (agentId: string) => {
    try {
      const response = await apiFetch(`${API_URL}/pme/${loggedUser.pmeId}/agents/${agentId}/valider`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${loggedUser.token}` }
      }, handleSessionExpired);
      if (response.ok) {
        Alert.alert('Succes', "L'agent a ete valide !");
        setPendingAgents(pendingAgents.filter((a) => a.id !== agentId));
      } else {
        Alert.alert('Erreur', 'Impossible de valider cet agent.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    }
  };

  const handleRejectAgent = async (agentId: string) => {
    try {
      const response = await apiFetch(`${API_URL}/pme/${loggedUser.pmeId}/agents/${agentId}/rejeter`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${loggedUser.token}` }
      }, handleSessionExpired);
      if (response.ok) {
        Alert.alert('Rejete', "L'agent a ete rejete et bloque.");
        setPendingAgents(pendingAgents.filter((a) => a.id !== agentId));
      } else {
        Alert.alert('Erreur', 'Impossible de rejeter cet agent.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedUser');
    navigation.replace('Welcome');
  };

  const handleSessionExpired = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4527A0" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={[styles.banner, { backgroundColor: '#4527A0' }]}>
          <View>
            <Text style={styles.welcomeText}>{'🏢'} Espace Gerant PME</Text>
            <Text style={{ color: '#EDE7F6', fontSize: 13, marginTop: 2 }}>{' '} {loggedUser.name || 'Gerant'} - {loggedUser.phone}</Text>
          </View>
          <TouchableOpacity style={[styles.profileBadgeLink, { backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileBadgeText}>{'⚙️'} Profil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.mainSectionTitle}>{' '} Agents en attente de validation</Text>

        {pendingAgents.length === 0 ? (
          <View style={styles.infoCard}>
            <Text style={styles.emptyText}>Aucun agent en attente de validation pour le moment.</Text>
          </View>
        ) : (
          pendingAgents.map((agent) => (
            <View key={agent.id} style={styles.scenarioCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={{ fontSize: 26, marginRight: 10 }}>{' '}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>{agent.nom} {agent.prenom}</Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{' '} Tel : <Text style={{ fontWeight: 'bold' }}>{agent.telephone}</Text></Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Specialisation : {agent.specialisation}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]} onPress={() => handleValidateAgent(agent.id)}>
                  <Text style={styles.actionButtonText}>{'✅'} Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F44336' }]} onPress={() => handleRejectAgent(agent.id)}>
                  <Text style={styles.actionButtonText}>{'❌'} Rejeter</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{' '} Se deconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  banner: { padding: 20, paddingTop: 30, paddingBottom: 25, marginHorizontal: -16, marginTop: -16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8, marginBottom: 15 },
  welcomeText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  profileBadgeLink: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  profileBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  mainSectionTitle: { fontSize: 14, fontWeight: '800', color: '#333', marginTop: 15, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 15 },
  emptyText: { color: '#999', fontStyle: 'italic', textAlign: 'center', paddingVertical: 10 },
  scenarioCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 15, borderWidth: 1, borderColor: '#EAEAEA' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#FFEBEE', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#FFCDD2' },
  logoutButtonText: { color: '#D32F2F', fontSize: 15, fontWeight: 'bold' },
});
