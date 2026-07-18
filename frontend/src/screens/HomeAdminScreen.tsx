import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, RefreshControl, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../utils/apiFetch';

const { width } = Dimensions.get('window');

interface HomeAdminScreenProps {
  navigation: any;
}

const API_URL = 'http://192.168.1.198:8080/api/v1';

export default function HomeAdminScreen({ navigation }: HomeAdminScreenProps) {
  const [loggedUser, setLoggedUser] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ agentsActifs: 0, alertesJour: 0, reclamations: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const val = await AsyncStorage.getItem('loggedUser');
      if (val) {
        const user = JSON.parse(val);
        setLoggedUser(user);
        fetchStats(user);
      }
    };
    init();
  }, []);

  const fetchStats = async (user: any) => {
    try {
      // Simulation d'un appel API pour les statistiques du tableau de bord
      // Dans une implementation complete, nous appellerions : 
      // await apiFetch(`${API_URL}/admin/stats`, 'GET', null, user.token)
      setTimeout(() => {
        setStats({ agentsActifs: 12, alertesJour: 45, reclamations: 3 });
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats(loggedUser);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedUser');
    navigation.replace('Welcome');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c896" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {loggedUser.name || 'Superviseur'}</Text>
          <Text style={styles.roleText}>R'le : {loggedUser.role === 'ADMIN' ? 'Administrateur Etat' : 'Gerant PME'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Deconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00c896" />}
      >
        <Text style={styles.sectionTitle}>Tableau de bord (Temps reel)</Text>

        <View style={styles.statsGrid}>
          {/* Carte 1 */}
          <View style={[styles.statCard, { borderTopColor: '#00c896', borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>{stats.alertesJour}</Text>
            <Text style={styles.statLabel}>Collectes (Auj.)</Text>
          </View>
          
          {/* Carte 2 */}
          <View style={[styles.statCard, { borderTopColor: '#3b82f6', borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>{stats.agentsActifs}</Text>
            <Text style={styles.statLabel}>Agents Actifs</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {/* Carte 3 */}
          <View style={[styles.statCard, { borderTopColor: '#ef4444', borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>{stats.reclamations}</Text>
            <Text style={styles.statLabel}>Reclamations</Text>
          </View>
          
          {/* Carte 4 (PME specifiques) */}
          <View style={[styles.statCard, { borderTopColor: '#f59e0b', borderTopWidth: 4 }]}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>PME / Zones</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        
        {loggedUser.role === 'GERANT_PME' && (
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('HomePme')}>
            <Text style={styles.actionButtonIcon}> </Text>
            <View>
              <Text style={styles.actionButtonTitle}>Gerer mes Agents</Text>
              <Text style={styles.actionButtonDesc}>Valider ou bloquer les inscriptions</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>🏢i⚙️</Text>
          <View>
            <Text style={styles.actionButtonTitle}>Supervision Terrain</Text>
            <Text style={styles.actionButtonDesc}>Suivi des tournees en cours (✅ venir)</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonIcon}>a❌i⚙️</Text>
          <View>
            <Text style={styles.actionButtonTitle}>Centre d'Urgences</Text>
            <Text style={styles.actionButtonDesc}>Traiter les reclamations et anomalies</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  loadingContainer: { flex: 1, backgroundColor: '#0a0e1a', justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  greeting: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  roleText: { fontSize: 13, color: '#00c896', marginTop: 4, fontWeight: '600', textTransform: 'uppercase' },
  logoutButton: { backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutButtonText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  scrollContent: { padding: 24, paddingBottom: 50 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#94a3b8', marginBottom: 16, marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: { fontSize: 36, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  actionButtonIcon: { fontSize: 28, marginRight: 16 },
  actionButtonTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  actionButtonDesc: { fontSize: 13, color: '#94a3b8' }
});
