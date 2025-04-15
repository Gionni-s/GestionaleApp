import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import apiClient from '../../services/axios';
import Store from '../../services/store';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    if (!isLogin && (!username || !surname)) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/users/login' : '/users/register';

      let response;

      // For login, use Basic Auth
      if (isLogin) {
        // Base64 encoding for React Native
        const credentials = btoa(`${email}:${password}`);

        response = await apiClient.post(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          },
        );
      } else {
        // For registration, send data in request body
        response = await apiClient.post(endpoint, {
          email,
          password,
          username,
          surname,
          phone,
        });
      }

      if (response.data && response.data.token) {
        // Store token and navigate to main app
        await Store.storeData('token', response.data.token);
      } else {
        console.log(response.data);
        Alert.alert('Error', 'Token not received from server');
      }
    } catch (error: any) {
      console.log('Auth error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear form fields
    setEmail('');
    setPassword('');
    setUsername('');
    setSurname('');
    setPhone('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.logo}>BRAND</Text>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Sign in to continue to your account'
                : 'Complete the form to get started'}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            {!isLogin && (
              <>
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="John"
                      value={username}
                      onChangeText={setUsername}
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Doe"
                      value={surname}
                      onChangeText={setSurname}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+1 (555) 123-4567"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAuth}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordBtn}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCancel}>
              <Text style={styles.secondaryButtonText}>Clear Form</Text>
            </TouchableOpacity>
          </View>

          {/* Switch Mode Button */}
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text style={styles.switchTextBold}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerSection: {
    marginBottom: 36,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#3B82F6',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  actionSection: {
    marginBottom: 32,
  },
  primaryButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '500',
  },
  forgotPasswordBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '500',
  },
  switchContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchText: {
    fontSize: 15,
    color: '#6B7280',
  },
  switchTextBold: {
    fontWeight: '700',
    color: '#3B82F6',
  },
});

export default AuthScreen;
