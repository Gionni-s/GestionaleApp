import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import axios from '../../services/axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: number;
  profileImage: string | null;
}

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState(128);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const getUser = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get('/users/me');
      setUser(data);
      setEditedUser(data);
      setLoading(false);
    } catch (err) {
      console.log('Error in request, retrying in 10 seconds...', err);
      setTimeout(getUser, 10000);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleUpdate = async () => {
    if (!editedUser) {
      return;
    }

    try {
      setLoading(true);
      await axios.put('/users/update', editedUser);
      setUser(editedUser);
      setIsEditing(false);
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      console.log('Error updating profile:', err);
      Alert.alert('Error', 'Failed to update profile');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => console.log('Logout'),
      },
    ]);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser({...editedUser, [field]: value});
    }
  };

  const getBackgroundColor = () => {
    return `rgb(${color}, ${color}, ${color})`;
  };

  if (loading && !user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#F43F5E" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarSection}>
            <View
              style={[
                styles.avatarContainer,
                {backgroundColor: getBackgroundColor()},
              ]}>
              {avatar ? (
                <Image source={{uri: avatar}} style={styles.avatar} />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.name.charAt(0).toUpperCase()}
                  {user?.surname.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[styles.input, isEditing && styles.editableInput]}
                value={isEditing ? editedUser?.name : user?.name}
                onChangeText={value => handleInputChange('name', value)}
                editable={isEditing}
                placeholder="First Name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[styles.input, isEditing && styles.editableInput]}
                value={isEditing ? editedUser?.surname : user?.surname}
                onChangeText={value => handleInputChange('surname', value)}
                editable={isEditing}
                placeholder="Last Name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, isEditing && styles.editableInput]}
                value={isEditing ? editedUser?.email : user?.email}
                onChangeText={value => handleInputChange('email', value)}
                editable={isEditing}
                keyboardType="email-address"
                placeholder="Email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, isEditing && styles.editableInput]}
                value={
                  isEditing
                    ? String(editedUser?.phoneNumber)
                    : String(user?.phoneNumber)
                }
                onChangeText={value => handleInputChange('phoneNumber', value)}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholder="Phone Number"
              />
            </View>
          </View>

          <View style={styles.themeSection}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <Text style={styles.label}>Avatar Background</Text>
            <View style={styles.sliderContainer}>
              <View
                style={[
                  styles.colorPreview,
                  {backgroundColor: getBackgroundColor()},
                ]}
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={255}
                step={1}
                value={color}
                onValueChange={setColor}
                minimumTrackTintColor="#6366F1"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#6366F1"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdate}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Icon
                  name="pencil"
                  size={18}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  logoutText: {
    color: '#F43F5E',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#E5E7EB',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  changePhotoButton: {
    marginTop: 12,
    padding: 8,
  },
  changePhotoText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  themeSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
    color: '#1F2937',
  },
  editableInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6366F1',
    borderWidth: 1.5,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  editButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    flex: 2,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 12,
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default ProfileScreen;
