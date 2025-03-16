import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AuthScreen from './src/Page/Auth';
import Navbar from './src/Page/Navbar';
import Store from './src/services/store';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await Store.getData('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Errore nel recupero del token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return token ? <Navbar /> : <AuthScreen />;
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
