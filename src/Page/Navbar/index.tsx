import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from '../Home';
import ProfileScreen from '../Profile';

const Tab = createBottomTabNavigator();

const Navbar = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#fff',
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Icon name={iconName} size={size || 24} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#333',
    paddingBottom: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Navbar;
