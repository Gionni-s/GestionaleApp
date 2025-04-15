import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export default class Store {
  constructor() {}

  static async storeData(key: string, value: string) {
    try {
      console.log(key, value);
      await AsyncStorage.setItem(key, value);
    } catch (e: any) {
      Alert.alert(
        'Errore',
        e.response?.data?.message || 'Qualcosa è andato storto',
      );
      return null;
    }
  }

  static async storeObjectData(key: string, value: object) {
    try {
      const jsonValue = JSON.stringify(value);
      console.log(key, jsonValue);
      await AsyncStorage.setItem(key, jsonValue); // Fixed: using variable key instead of hardcoded 'my-key'
    } catch (e: any) {
      Alert.alert(
        'Errore',
        e.response?.data?.message || 'Qualcosa è andato storto',
      );
      return null;
    }
  }

  static async getData(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? value : null;
    } catch (e: any) {
      Alert.alert(
        'Errore',
        e.response?.data?.message || 'Qualcosa è andato storto',
      );
      return null;
    }
  }

  static async getObject(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e: any) {
      Alert.alert(
        'Errore',
        e.response?.data?.message || 'Qualcosa è andato storto',
      );
      return null;
    }
  }

  /**
   * Removes data for the specified key from AsyncStorage
   * @param key Key to remove from storage
   * @returns true if successful, null if error occurred
   */
  static async removeData(key: string) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e: any) {
      Alert.alert(
        'Errore',
        e.response?.data?.message || 'Impossibile rimuovere i dati',
      );
      return null;
    }
  }

  /**
   * Clears all data from AsyncStorage
   * @returns true if successful, null if error occurred
   */
  static async clearAllData() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e: any) {
      Alert.alert(
        'Errore',
        e.response?.data?.message || 'Impossibile cancellare tutti i dati',
      );
      return null;
    }
  }
}
