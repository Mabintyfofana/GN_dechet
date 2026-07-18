import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, StatusBar, Linking, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { apiFetch } from '../utils/apiFetch';

interface HomeMenageScreenProps {
  navigation: any;
}

const API_URL = 'http://192.168.1.198:8080/api/v1';

type VolumeType = 'PETIT' | 'GRAND' | 'GROS';

export default function HomeMenageScreen({ navigation }: HomeMenageScreenProps) {
  const [loggedUser, setLoggedUser] = useState<any>({});

  useEffect(() => {
    AsyncStorage.getItem('loggedUser').then(val => {
      if (val) setLoggedUser(JSON.parse(val));
    });
  }, []);

  const [selectedVolume, setSelectedVolume] = useState<VolumeType>('GRAND');
  const [plasticAlertSent, setPlasticAlertSent] = useState(false);
  const [currentAlertId, setCurrentAlertId] = useState<string | null>(null);
  const [historique, setHistorique] = useState<any[]>([]);
  const [secteurAgents, setSecteurAgents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchSecteurAgents();
    fetchHistorique(0, true);
  }, [loggedUser.token]);

  const fetchHistorique = async (pageNumber = 0, reset = false) => {
    if (loadingMore || (!hasMore && !reset)) return;
    if (pageNumber > 0) setLoadingMore(true);

    try {
      const response = await apiFetch(`${API_URL}/ramassages/historique?page=${pageNumber}&size=10`, {
        headers: { 'Authorization': `Bearer ${loggedUser.token}` }
      }, handleSessionExpired);

      if (response.ok) {
        const data = await response.json();
        const formattedHistory = data.content.map((item: any) => ({
          id: item.id,
          date: new Date(item.dateEffective || item.datePrevue).toLocaleDateString(),
          type: item.typeDechet === 'PLASTIQUE' ? 'Plastique' : 'Ordures Menageres',
          quantite: item.observations || (item.volumeM3 ? `${item.volumeM3} m3` : 'Non precise'),
          statut: item.statut === 'FAIT' ? 'Recupere' : 'En attente',
          agent: item.collecteur ? (item.collecteur.nom + ' ' + (item.collecteur.prenom || '')) : "En attente d'affectation"
        }));

        setHistorique(reset ? formattedHistory : [...historique, ...formattedHistory]);
        setPage(pageNumber);
        setHasMore(!data.last);
      }
    } catch (error) {
      console.error('Erreur fetchHistorique', error);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSecteurAgents();
    fetchHistorique(0, true);
  };

  const loadMoreHistorique = () => {
    if (hasMore && !loadingMore) {
      fetchHistorique(page + 1);
    }
  };

  const fetchSecteurAgents = async () => {
    try {
      const response = await apiFetch(`${API_URL}/utilisateurs/agents`, {
        headers: { 'Authorization': `Bearer ${loggedUser.token}` }
      }, handleSessionExpired);
      if (response.ok) {
        const data = await response.json();
        const formattedAgents = data.map((agent: any) => ({
          id: agent.id,
          name: agent.nom + ' ' + (agent.prenom || ''),
          phone: agent.telephone || 'Non renseigne',
          engin: 'Tricycle (' + (agent.zone ? agent.zone.nom : 'Local') + ')'
        }));
        setSecteurAgents(formattedAgents);
      }
    } catch (error) {
      console.error('Erreur fetchSecteurAgents', error);
    }
  };

  const triggerWasteAlert = async (typeDechet: 'PLASTIQUE' | 'AUTRES_DECHETS') => {
    let volumeText = '1 grand sac';
    if (selectedVolume === 'PETIT') volumeText = '1 a 2 petits sacs';
    if (selectedVolume === 'GROS') volumeText = 'Gros volume (3+ sacs)';

    try {
      const response = await apiFetch(`${API_URL}/ramassages/demande`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}`
        },
        body: JSON.stringify({ volumeText: volumeText, typeDechet: typeDechet })
      }, handleSessionExpired);

      if (response.ok) {
        const data = await response.json();
        setPlasticAlertSent(true);
        setCurrentAlertId(data.id);
        const nouvelleAlerteHist = {
          id: data.id,
          date: "Aujourd'hui",
          type: typeDechet === 'PLASTIQUE' ? 'Plastique' : 'Ordures Menageres',
          quantite: volumeText,
          statut: 'En attente',
          agent: "En attente d'affectation"
        };
        setHistorique([nouvelleAlerteHist, ...historique]);
        Alert.alert('Alerte transmise', `Demande enregistree (${volumeText}).`);
      } else {
        Alert.alert('Erreur', 'La creation de la demande a echoue.');
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

  const cancelAlert = async () => {
    if (!currentAlertId) return;
    try {
      const response = await apiFetch(`${API_URL}/ramassages/${currentAlertId}/annuler`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${loggedUser.token}` }
      }, handleSessionExpired);
      if (response.ok) {
        setPlasticAlertSent(false);
        setCurrentAlertId(null);
        fetchHistorique(0, true);
      } else {
        Alert.alert('Erreur', "Impossible d'annuler la demande.");
      }
    } catch (error) {
      console.error('Erreur annulation', error);
    }
  };

  const passerAppelDirect = (telephone: string) => {
    if (!telephone) {
      Alert.alert('Erreur', 'Aucun numero de telephone disponible.');
      return;
    }
    const urlAppel = Platform.OS === 'android' ? `tel:${telephone}` : `telprompt:${telephone}`;
    Linking.canOpenURL(urlAppel)
      .then((supported) => {
        if (!supported) Alert.alert('Erreur', 'Votre smartphone ne permet pas de passer des appels.');
        else return Linking.openURL(urlAppel);
      })
      .catch((err) => console.error(err));
  };

  const envoyerSmsDirect = (telephone: string, messageText: string) => {
    if (!telephone) {
      Alert.alert('Erreur', "Aucun numero disponible pour l'envoi de SMS.");
      return;
    }
    const separateur = Platform.OS === 'ios' ? '&' : '?';
    const urlSms = `sms:${telephone}${separateur}body=${encodeURIComponent(messageText)}`;
    Linking.canOpenURL(urlSms)
      .then((supported) => {
        if (!supported) Alert.alert('Erreur', "Impossible d'ouvrir l'application de messagerie.");
        else return Linking.openURL(urlSms);
      })
      .catch((err) => console.error(err));
  };

  const renderHeader = () => (
    <>
      <View style={styles.banner}>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text style={styles.welcomeText} numberOfLines={1} adjustsFontSizeToFit>Espace Menage : {loggedUser.name || 'Utilisateur'} {'🏠'}</Text>
          <Text style={{ color: '#E8F5E9', fontSize: 13, marginTop: 2 }} numberOfLines={1}>{'📍'} Quartier : {loggedUser.quartier || 'Non renseigne'} {'•'} {'📞'} {loggedUser.phone}</Text>
        </View>
        <TouchableOpacity style={styles.profileBadgeLink} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileBadgeText}>{'☎️'} Coordonnees</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.mainSectionTitle}>Demander un ramassage</Text>
      <View style={[styles.scenarioCard, { borderColor: '#0288D1', borderWidth: 1 }]}>
        <Text style={styles.scenarioDescription}>Selectionnez la quantite de sacs plastiques a recuperer pour aider le collecteur a s'organiser :</Text>

        <View style={styles.volumeContainer}>
          <TouchableOpacity style={[styles.volumeBox, selectedVolume === 'PETIT' && styles.volumeBoxActive]} onPress={() => setSelectedVolume('PETIT')}>
            <Text style={styles.volumeEmoji}>{'🛍️'}</Text>
            <Text style={styles.volumeLabel}>1-2 Petits sacs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.volumeBox, selectedVolume === 'GRAND' && styles.volumeBoxActive]} onPress={() => setSelectedVolume('GRAND')}>
            <Text style={styles.volumeEmoji}>{'🗑️'}</Text>
            <Text style={styles.volumeLabel}>1 Grand sac</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.volumeBox, selectedVolume === 'GROS' && styles.volumeBoxActive]} onPress={() => setSelectedVolume('GROS')}>
            <Text style={styles.volumeEmoji}>{'📦'}</Text>
            <Text style={styles.volumeLabel}>Gros Volume</Text>
          </TouchableOpacity>
        </View>

        {!plasticAlertSent ? (
          <View>
            <TouchableOpacity style={styles.plasticButton} onPress={() => triggerWasteAlert('PLASTIQUE')}>
              <Text style={styles.plasticButtonText}>{'♻️'} Alerte Plastique (Cooperative)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.plasticButton, { backgroundColor: '#2E7D32', marginTop: 10 }]} onPress={() => triggerWasteAlert('AUTRES_DECHETS')}>
              <Text style={styles.plasticButtonText}>{'🗑️'} Alerte Ordures (PME locale)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.alertActiveBox}>
            <Text style={styles.alertActiveText}>{'⏳'} Demande envoyee ! Le collecteur doit scanner ce QR Code a son arrivee.</Text>

            {currentAlertId && (
              <View style={{ alignItems: 'center', marginVertical: 15 }}>
                <QRCode value={currentAlertId} size={150} color="black" backgroundColor="white" />
              </View>
            )}

            <TouchableOpacity style={{ marginTop: 6, alignItems: 'center' }} onPress={cancelAlert}>
              <Text style={{ color: '#D32F2F', fontSize: 13, textDecorationLine: 'underline' }}>Annuler la demande</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.mainSectionTitle}>{'👥'} Collecteurs de votre secteur ({loggedUser.quartier || 'Local'})</Text>
      <View style={styles.infoCard}>
        {secteurAgents.length === 0 ? (
          <Text style={styles.emptyText}>Aucun agent disponible dans votre secteur pour le moment.</Text>
        ) : (
          secteurAgents.map((agent) => (
            <View key={agent.id} style={styles.directoryRow}>
              <View>
                <Text style={{ fontWeight: 'bold', color: '#333' }}>{agent.name}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{agent.engin}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.contactMiniButton, { backgroundColor: '#E8F5E9' }]} onPress={() => passerAppelDirect(agent.phone)}>
                  <Text style={{ fontSize: 14 }}>{'📞'} Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.contactMiniButton, { backgroundColor: '#E3F2FD', marginLeft: 8 }]} onPress={() => envoyerSmsDirect(agent.phone, `Bonjour, j'habite a ${loggedUser.quartier}, j'ai un depot de plastique disponible.`)}>
                  <Text style={{ fontSize: 14 }}>{'💬'} SMS</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <Text style={styles.mainSectionTitle}>Historique &amp; Suivi des passages</Text>
      {historique.length === 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.emptyText}>Aucun ramassage enregistre pour le moment.</Text>
        </View>
      )}
    </>
  );

  const renderFooter = () => (
    <>
      {loadingMore && <ActivityIndicator size="small" color="#2E7D32" style={{ marginVertical: 10 }} />}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{'🚪'} Se deconnecter</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        data={historique}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />}
        onEndReached={loadMoreHistorique}
        onEndReachedThreshold={0.2}
        renderItem={({ item }) => (
          <View style={[styles.infoCard, { marginBottom: 10 }]}>
            <View style={styles.historyRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontWeight: '600', color: '#333' }}>{item.type} ({item.quantite})</Text>
                <Text style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{'🤝'} Collecteur : <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>{item.agent}</Text></Text>
                <Text style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{item.date}</Text>
              </View>
              <View style={[styles.miniBadge, { backgroundColor: item.statut === 'Recupere' ? '#E8F5E9' : '#E1F5FE' }]}>
                <Text style={{ fontSize: 11, color: item.statut === 'Recupere' ? '#2E7D32' : '#0288D1', fontWeight: 'bold' }}>{item.statut}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  banner: { backgroundColor: '#2E7D32', marginHorizontal: -16, marginTop: -16, padding: 20, paddingTop: 30, paddingBottom: 25, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  welcomeText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  profileBadgeLink: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  profileBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  mainSectionTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginTop: 24, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  scenarioCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 10 },
  scenarioDescription: { fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 18 },
  volumeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  volumeBox: { flex: 1, backgroundColor: '#F1F3F5', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 5, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#E9ECEF' },
  volumeBoxActive: { backgroundColor: '#E1F5FE', borderColor: '#0288D1' },
  volumeEmoji: { fontSize: 24, marginBottom: 4 },
  volumeLabel: { fontSize: 11, fontWeight: '600', color: '#333', textAlign: 'center' },
  plasticButton: { backgroundColor: '#0288D1', borderRadius: 12, paddingVertical: 14, alignItems: 'center', shadowColor: '#0288D1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  plasticButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  alertActiveBox: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FFE0B2' },
  alertActiveText: { color: '#E65100', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  emptyText: { color: '#999', fontStyle: 'italic', textAlign: 'center', paddingVertical: 10 },
  directoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  contactMiniButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  miniBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  logoutButton: { backgroundColor: '#FFEBEE', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#FFCDD2' },
  logoutButtonText: { color: '#D32F2F', fontSize: 15, fontWeight: 'bold' },
});
