import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, StatusBar, Modal, Linking, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { apiFetch } from '../utils/apiFetch';

interface HomeAgentScreenProps {
  navigation: any;
}

const API_URL = 'http://192.168.1.198:8080/api/v1';

export default function HomeAgentScreen({ navigation }: HomeAgentScreenProps) {
  const [loggedUser, setLoggedUser] = useState<any>({});
  
  useEffect(() => {
    AsyncStorage.getItem('loggedUser').then(val => {
      if(val) setLoggedUser(JSON.parse(val));
    });
  }, []);
  const [agentTasks, setAgentTasks] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchAgentTasks(0, true);
    const interval = setInterval(() => { fetchAgentTasks(0, true); }, 30000);
    return () => clearInterval(interval);
  }, [loggedUser.token]);

  const fetchAgentTasks = async (pageNumber = 0, reset = false) => {
    if (loadingMore || (!hasMore && !reset)) return;
    if (pageNumber > 0) setLoadingMore(true);

    try {
      const response = await apiFetch(`${API_URL}/ramassages/en-attente?page=${pageNumber}&size=10`, {
        headers: { 'Authorization': `Bearer ${loggedUser.token}` }
      }, handleSessionExpired);
      
      if (response.ok) {
        const data = await response.json();
        const formattedTasks = data.content.map((item: any) => ({
          id: item.id,
          menage: item.menage.nom + ' ' + (item.menage.prenom || ''),
          telephone: item.menage.telephone || 'Inconnu',
          quartier: item.menage.zone ? item.menage.zone.nom : 'Inconnu',
          details: (item.typeDechet === 'PLASTIQUE' ? '♻️ Plastique' : '🗑️ Ordure') + ' - ' + (item.observations || ''),
          heure: new Date(item.datePrevue).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          statut: item.statut === 'EN_ATTENTE' ? 'En attente' : 'Recupere'
        }));

        setAgentTasks(reset ? formattedTasks : [...agentTasks, ...formattedTasks]);
        setPage(pageNumber);
        setHasMore(!data.last);
      }
    } catch (error) {
      console.error("Erreur fetchAgentTasks", error);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAgentTasks(0, true);
  };

  const loadMoreTasks = () => {
    if (hasMore && !loadingMore) {
      fetchAgentTasks(page + 1);
    }
  };

  const handleValidateCollect = async (id: string) => {
    try {
      const response = await apiFetch(`${API_URL}/ramassages/${id}/valider`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loggedUser.token}` 
        },
        body: JSON.stringify({ poidsKg: 10, volumeM3: 0.5, observations: 'Collecte standard' })
      }, handleSessionExpired);
      
      if (response.ok) {
        setAgentTasks(agentTasks.map(task => task.id === id ? { ...task, statut: 'Recupere' } : task));
        Alert.alert("\u2705 Valide", "Le ramassage a bien ete enregistre en base.");
        setIsScanning(false);
      } else {
        Alert.alert("Erreur", "La validation a echoue.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };

  const onBarcodeScanned = (scanningResult: any) => {
    if (!isScanning) return;
    const scannedId = scanningResult.data;
    
    const taskMatch = agentTasks.find(t => t.id === scannedId);
    if (taskMatch) {
      if (taskMatch.statut === 'En attente') {
        handleValidateCollect(scannedId);
      } else {
        Alert.alert("Info", "Cette collecte a deja ete validee.");
        setIsScanning(false);
      }
    } else {
      Alert.alert("Erreur", "QR Code non reconnu ou n'appartient pas a vos taches actuelles.");
      setIsScanning(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedUser');
    navigation.replace('Welcome');
  };

  const handleSessionExpired = () => {
    navigation.replace('Login');
  };

  const passerAppelDirect = (telephone: string) => {
    if (!telephone) {
      Alert.alert("Erreur", "Aucun numero de telephone disponible.");
      return;
    }
    const urlAppel = Platform.OS === 'android' ? `tel:${telephone}` : `telprompt:${telephone}`;
    Linking.canOpenURL(urlAppel)
      .then((supported) => {
        if (!supported) Alert.alert("Erreur", "Votre smartphone ne permet pas de passer des appels.");
        else return Linking.openURL(urlAppel);
      })
      .catch((err) => console.error(err));
  };

  const envoyerSmsDirect = (telephone: string, messageText: string) => {
    if (!telephone) {
      Alert.alert("Erreur", "Aucun numero disponible pour l'envoi de SMS.");
      return;
    }
    const separateur = Platform.OS === 'ios' ? '&' : '?';
    const urlSms = `sms:${telephone}${separateur}body=${encodeURIComponent(messageText)}`;
    Linking.canOpenURL(urlSms)
      .then((supported) => {
        if (!supported) Alert.alert("Erreur", "Impossible d'ouvrir l'application de messagerie.");
        else return Linking.openURL(urlSms);
      })
      .catch((err) => console.error(err));
  };


  const renderHeader = () => (
    <>
      <View style={[styles.banner, { backgroundColor: '#1565C0' }]}>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text style={styles.welcomeText} numberOfLines={1} adjustsFontSizeToFit>Espace Collecteur : {loggedUser.name || 'Agent'} {'👷'}</Text>
          <Text style={{color: '#E3F2FD', fontSize: 13, marginTop: 2}} numberOfLines={1}>{'📞'} Mon numero : {loggedUser.phone}</Text>
        </View>
        <TouchableOpacity style={[styles.profileBadgeLink, {backgroundColor: 'rgba(255,255,255,0.2)'}]} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileBadgeText}>{'⚙️'} Profil</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.mainSectionTitle}>{'📢'} Signalements a recuperer (Tri direct)</Text>
      
      {agentTasks.length === 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.emptyText}>Aucune alerte ou demande en cours dans votre secteur.</Text>
        </View>
      )}
    </>
  );

  const renderFooter = () => (
    <>
      {loadingMore && <ActivityIndicator size="small" color="#1565C0" style={{ marginVertical: 10 }} />}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{'🚪'} Se deconnecter</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        data={agentTasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1565C0"]} />}
        onEndReached={loadMoreTasks}
        onEndReachedThreshold={0.2}
        renderItem={({ item: task }) => (
          <View style={[styles.scenarioCard, task.statut === 'Recupere' && { opacity: 0.6, borderColor: '#DDD' }]}>
            <View style={styles.cardHeaderRow}>
              <Text style={{fontSize: 26, marginRight: 10}}>{'🏠'}</Text>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 15, fontWeight: 'bold', color: '#333'}}>{task.menage}</Text>
                <Text style={{fontSize: 12, color: '#666', marginTop: 2}}>Secteur : <Text style={{fontWeight: 'bold', color: '#1565C0'}}>{task.quartier}</Text> &bull; {task.heure}</Text>
                <Text style={{fontSize: 13, color: '#333', marginTop: 4, fontWeight: '500'}}>{'📦'} Volume declare : <Text style={{color: '#0288D1', fontWeight: 'bold'}}>{task.details}</Text></Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            {task.statut === 'En attente' ? (
              <View>
                <View style={styles.actionContactRow}>
                  <TouchableOpacity style={[styles.actionContactButton, {backgroundColor: '#4CAF50'}]} onPress={() => passerAppelDirect(task.telephone)}>
                    <Text style={styles.actionContactText}>{'📞'} Appeler ({task.telephone})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionContactButton, {backgroundColor: '#2196F3'}]} onPress={() => envoyerSmsDirect(task.telephone, `Bonjour ${task.menage}, c'est le collecteur GN Dechet. Je suis en route vers votre position pour vos PLASTIQUES.`)}>
                    <Text style={styles.actionContactText}>{'💬'} SMS</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.agentValidateButton, {backgroundColor: '#FF9800'}]} onPress={async () => {
                    if (!permission?.granted) {
                      const result = await requestPermission();
                      if (result.granted) setIsScanning(true);
                      else Alert.alert("Erreur", "Permission camera refusee");
                    } else {
                      setIsScanning(true);
                    }
                  }}>
                  <Text style={styles.agentValidateButtonText}>{'📷'} Scanner pour valider</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.taskDoneBox}>
                <Text style={styles.taskDoneText}>{'✅'} Plastique recupere avec succes</Text>
              </View>
            )}
          </View>
        )}
      />
      
      {/* Scanner Modal */}
      <Modal visible={isScanning} animationType="slide">
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 40}}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Scannez le QR Code du Menage</Text>
            <TouchableOpacity onPress={() => setIsScanning(false)}>
              <Text style={{color: 'white', fontSize: 16}}>Fermer</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, overflow: 'hidden', borderRadius: 20, margin: 20}}>
            <CameraView 
              style={{flex: 1}} 
              facing="back"
              onBarcodeScanned={onBarcodeScanned}
            />
          </View>
          <View style={{padding: 30, alignItems: 'center'}}>
            <Text style={{color: 'white', textAlign: 'center'}}>Placez le QR Code affiche sur le telephone du menage dans le cadre.</Text>
          </View>
        </SafeAreaView>
      </Modal>
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
  actionContactRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  actionContactButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  actionContactText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  agentValidateButton: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  agentValidateButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  taskDoneBox: { backgroundColor: '#E8F5E9', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  taskDoneText: { color: '#2E7D32', fontSize: 14, fontWeight: '700' },
  logoutButton: { backgroundColor: '#FFEBEE', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#FFCDD2' },
  logoutButtonText: { color: '#D32F2F', fontSize: 15, fontWeight: 'bold' },
});
