import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, StatusBar, ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.1.198:8080/api/v1';

interface Pme {
  id: string;
  nom: string;
  description: string;
  telephone: string;
  tarifMensuel: number;
  zoneCouverture: string;
}

export default function PmeListScreen({ navigation }: any) {
  const [pmeList, setPmeList] = useState<Pme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedPme, setSelectedPme] = useState<string | null>(null);
  const [loggedUser, setLoggedUser] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      const val = await AsyncStorage.getItem('loggedUser');
      if (val) setLoggedUser(JSON.parse(val));
      fetchPmeList();
    };
    init();
  }, []);

  const fetchPmeList = async () => {
    try {
      const response = await fetch(`${API_URL}/pme`);
      if (response.ok) {
        const data = await response.json();
        setPmeList(data);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger la liste des PME.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (pme: Pme) => {
    Alert.alert(
      `S'abonner a ${pme.nom}`,
      `Tarif mensuel : ${pme.tarifMensuel} GNF\nZone : ${pme.zoneCouverture}\n\nVoulez-vous confirmer ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => confirmSubscription(pme),
        },
      ]
    );
  };

  const confirmSubscription = async (pme: Pme) => {
    setIsSubscribing(true);
    setSelectedPme(pme.id);
    try {
      const response = await fetch(`${API_URL}/pme/${pme.id}/abonner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loggedUser.token}`,
        },
      });

      if (response.ok) {
        // Mettre a jour le loggedUser localement avec le pmeId
        const updatedUser = { ...loggedUser, pmeId: pme.id };
        await AsyncStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        Alert.alert('✅ Succes !', `Vous etes maintenant abonne a ${pme.nom}. Votre collecte sera organisee !`, [
          { text: 'Acceder a mon espace', onPress: () => navigation.replace('HomeMenage') },
        ]);
      } else {
        const err = await response.json().catch(() => null);
        Alert.alert('Erreur', err?.error || 'Echec de l\'abonnement.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    } finally {
      setIsSubscribing(false);
      setSelectedPme(null);
    }
  };

  const renderItem = ({ item }: { item: Pme }) => {
    const isBeingSubscribed = isSubscribing && selectedPme === item.id;
    return (
      <View style={styles.card}>
        {/* Badge Zone */}
        <View style={styles.zoneBadge}>
          <Text style={styles.zoneBadgeText}>📍 {item.zoneCouverture || 'Zone non definie'}</Text>
        </View>

        <Text style={styles.pmeName}>{item.nom}</Text>
        <Text style={styles.pmeDescription} numberOfLines={2}>
          {item.description || 'Collecte et gestion des dechets menagers.'}
        </Text>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>  Contact</Text>
          <Text style={styles.infoValue}>{item.telephone || 'N/D'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>💰 Tarif Mensuel</Text>
          <Text style={[styles.infoValue, { color: '#00c896', fontWeight: '800' }]}>
            {item.tarifMensuel ? `${item.tarifMensuel.toLocaleString()} GNF` : 'Gratuit'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, isBeingSubscribed && styles.subscribeButtonDisabled]}
          onPress={() => handleSubscribe(item)}
          disabled={isSubscribing}
          activeOpacity={0.8}
        >
          {isBeingSubscribed
            ? <ActivityIndicator size="small" color="#000" />
            : <Text style={styles.subscribeButtonText}>Choisir cette PME</Text>
          }
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choisissez votre Cooperative</Text>
        <Text style={styles.headerSubtitle}>Selectionnez la PME qui collecte dans votre quartier.</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00c896" />
          <Text style={styles.loaderText}>Chargement des PME...</Text>
        </View>
      ) : pmeList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🗑️</Text>
          <Text style={styles.emptyTitle}>Aucune PME disponible</Text>
          <Text style={styles.emptyDesc}>Les cooperatives de collecte seront bientot disponibles dans votre zone.</Text>
        </View>
      ) : (
        <FlatList
          data={pmeList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  headerSubtitle: { fontSize: 14, color: '#94a3b8', lineHeight: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: '#94a3b8', marginTop: 16, fontSize: 15 },
  listContent: { padding: 20, paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 10, textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 22 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  zoneBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,200,150,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
  },
  zoneBadgeText: { fontSize: 12, color: '#00c896', fontWeight: '700' },
  pmeName: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  pmeDescription: { fontSize: 14, color: '#94a3b8', lineHeight: 20, marginBottom: 16 },
  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  infoLabel: { fontSize: 13, color: '#64748b' },
  infoValue: { fontSize: 14, color: '#e2e8f0', fontWeight: '600' },
  subscribeButton: {
    backgroundColor: '#00c896',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#00c896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  subscribeButtonDisabled: { opacity: 0.6 },
  subscribeButtonText: { color: '#000000', fontSize: 15, fontWeight: '800' },
});
