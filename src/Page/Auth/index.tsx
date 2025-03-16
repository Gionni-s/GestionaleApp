import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from '../../services/axios';
import Store from '../../services/store';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? '/users/login' : '/users/register';

      // Se è login, invia username e password come Basic Auth
      const headers = isLogin
        ? {
            Authorization: `Basic ${btoa(`${email}:${password}`)}`, // Base64 encoding
          }
        : {};

      const payload = isLogin
        ? {} // Nessun payload perché le credenziali sono negli headers
        : {email, password, username, surname, phone};

      // Effettua la richiesta
      let response = undefined;
      if (!isLogin) {
        response = await axios.post(endpoint, payload, {headers});
      } else {
        response = await axios.get(endpoint, {headers});
      }

      await Store.storeData('token', response.data.token);
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        'Errore',
        error.response?.data?.message || 'Qualcosa è andato storto',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Registrati'}</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="********"
        value={password}
        onChangeText={setPassword}
      />

      {!isLogin && (
        <>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="123456789"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? 'Non hai un account? Registrati'
            : "Sei già registrato? Fai l'accesso"}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Annulla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
          <Text style={styles.submitText}>
            {isLogin ? 'Login' : 'Registrati'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  switchButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  cancelText: {
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  submitText: {
    color: '#fff',
  },
});

export default AuthScreen;
