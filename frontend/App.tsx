import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importation des écrans
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PmeListScreen from './src/screens/PmeListScreen';
import HomeMenageScreen from './src/screens/HomeMenageScreen';
import HomeAgentScreen from './src/screens/HomeAgentScreen';
import HomeAdminScreen from './src/screens/HomeAdminScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const API_URL = 'http://192.168.1.198:8080/api/v1';

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUserStr = await AsyncStorage.getItem('loggedUser');
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          
          const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: storedUser.refreshToken })
          });

          if (response.ok) {
            const data = await response.json();
            const updatedUser = { ...storedUser, token: data.accessToken, refreshToken: data.refreshToken };
            await AsyncStorage.setItem('loggedUser', JSON.stringify(updatedUser));
            
            // Redirection dynamique basée sur le rôle
            if (updatedUser.role === 'ADMIN' || updatedUser.role === 'GERANT_PME') {
              setInitialRoute('HomeAdmin');
            } else if (updatedUser.role === 'AGENT' || updatedUser.role === 'COLLECTEUR') {
              setInitialRoute('HomeAgent');
            } else {
              // MENAGE : va directement sur son espace
              setInitialRoute('HomeMenage');
            }
          } else {
            await AsyncStorage.removeItem('loggedUser');
            setInitialRoute('Welcome');
          }
        }
      } catch (error) {
        console.error("Erreur de session", error);
        setInitialRoute('Welcome');
      } finally {
        setIsAppLoading(false);
      }
    };
    checkSession();
  }, []);

  if (isAppLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c896" />
        <Text style={styles.loadingText}>Démarrage de GN Déchet...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="PmeList" component={PmeListScreen} />
          
          <Stack.Screen name="HomeMenage" component={HomeMenageScreen} />
          <Stack.Screen name="HomeAgent" component={HomeAgentScreen} />
          <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
          
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e1a'
  },
  loadingText: {
    marginTop: 20,
    color: '#00c896',
    fontSize: 16,
    fontWeight: 'bold'
  }
});