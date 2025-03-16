import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import axios from '../../services/axios';

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: number;
  profileImage: string | null;
}

const getUser = async (
  setUser: (user: any) => void,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    const {data} = await axios.get('/users/me');
    setUser(data);
    setLoading(false);
  } catch (err) {
    console.log('Errore nella richiesta, riprovo tra 2 minuti...', err);
    setTimeout(() => getUser(setUser, setLoading), 120000); // 120000 ms = 2 minuti
  }
};

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState(128);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getUser(setUser, setLoading);
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      {/* Titolo e pulsante Logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Profilo</Text>
        <TouchableOpacity>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{uri: avatar}} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase()}
              {user?.surname.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Campi del profilo */}
      <TextInput style={styles.input} value={user?.name} editable={false} />
      <TextInput style={styles.input} value={user?.surname} editable={false} />
      <TextInput style={styles.input} value={user?.email} editable={false} />
      <TextInput
        style={styles.input}
        value={String(user?.phoneNumber)}
        editable={false}
      />

      {/* Color Picker */}
      <Text style={styles.label}>Colore</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={color}
        onValueChange={setColor}
        minimumTrackTintColor={`rgb(${color}, ${color}, ${color})`}
        maximumTrackTintColor="#000"
      />

      {/* Pulsanti */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.buttonText}>Aggiorna Profilo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Modifica</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Stili Migliorati
const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f9f9f9'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {fontSize: 26, fontWeight: 'bold', color: '#333'},
  logoutText: {color: '#d9534f', fontSize: 16, fontWeight: 'bold'},

  avatarContainer: {alignItems: 'center', marginBottom: 20},
  avatar: {
    width: 120,
    height: 120,
    // borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 3,
    borderColor: '#bbb',
    elevation: 5,
  },
  avatarText: {fontSize: 28, fontWeight: 'bold', color: '#555'},

  input: {
    borderWidth: 2,
    borderColor: '#bbb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 3,
  },
  label: {fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#444'},

  slider: {width: '100%', height: 40},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default ProfileScreen;
