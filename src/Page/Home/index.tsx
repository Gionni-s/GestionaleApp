import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Sample data - in a real app, this would come from your API or local storage
const SAMPLE_ITEMS = [
  {id: '1', name: 'Product A', expiryDate: '2025-04-20', daysLeft: 6},
  {id: '2', name: 'Product B', expiryDate: '2025-04-16', daysLeft: 2},
  {id: '3', name: 'Product C', expiryDate: '2025-04-15', daysLeft: 1},
  {id: '4', name: 'Product D', expiryDate: '2025-05-10', daysLeft: 26},
];

const HomeScreen = () => {
  const [expiringItems, setExpiringItems] = useState([]);

  useEffect(() => {
    // Filter items expiring within 7 days
    const soonExpiringItems = SAMPLE_ITEMS.filter(item => item.daysLeft <= 7);
    setExpiringItems(soonExpiringItems);
  }, []);

  const getAlertColor = (daysLeft: any) => {
    if (daysLeft <= 1) {
      return '#FF4D4D';
    }
    if (daysLeft <= 3) {
      return '#FFA500';
    }
    return '#4CAF50';
  };

  const renderExpiryItem = ({item}: any) => (
    <TouchableOpacity
      style={[
        styles.alertCard,
        {borderLeftColor: getAlertColor(item.daysLeft)},
      ]}
      onPress={() =>
        Alert.alert(
          `${item.name} Details`,
          `This item will expire on ${item.expiryDate}.\n${item.daysLeft} days remaining.`,
        )
      }>
      <View style={styles.alertContent}>
        <Icon
          name={item.daysLeft <= 1 ? 'warning' : 'time-outline'}
          size={24}
          color={getAlertColor(item.daysLeft)}
        />
        <View style={styles.alertTextContainer}>
          <Text style={styles.alertTitle}>{item.name}</Text>
          <Text style={styles.alertSubtitle}>
            Expires in {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Benvenuto nella Home!</Text>

      {expiringItems.length > 0 ? (
        <View style={styles.alertsContainer}>
          <View style={styles.alertsHeader}>
            <Icon name="notifications-outline" size={22} color="#333" />
            <Text style={styles.alertsTitle}>Expiration Alerts</Text>
          </View>

          <FlatList
            data={expiringItems}
            renderItem={renderExpiryItem}
            keyExtractor={item => item.id}
            style={styles.alertsList}
          />
        </View>
      ) : (
        <View style={styles.noAlertsContainer}>
          <Icon name="checkmark-circle-outline" size={50} color="#4CAF50" />
          <Text style={styles.noAlertsText}>No items expiring soon</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertsList: {
    maxHeight: 300,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderLeftWidth: 4,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTextContainer: {
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  noAlertsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAlertsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
