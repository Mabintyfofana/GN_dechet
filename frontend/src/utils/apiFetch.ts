import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Effectue un appel API authentifié.
 * Si le serveur retourne 401 (token expiré ou invalide),
 * supprime la session et redirige vers l'écran de connexion.
 *
 * @param url URL complète de l'endpoint
 * @param options Options fetch (method, headers, body…)
 * @param onUnauthorized Callback appelé si le token est expiré (typiquement setCurrentScreen('LOGIN'))
 */
export async function apiFetch(
  url: string,
  options: RequestInit,
  onUnauthorized: () => void
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    // Session expirée ou invalide — on purge et on redirige
    await AsyncStorage.removeItem('loggedUser');
    onUnauthorized();
  }

  return response;
}
