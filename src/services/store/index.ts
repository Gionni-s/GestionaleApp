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
      await AsyncStorage.setItem('my-key', jsonValue);
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
}
