import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from '../Home';
import ProfileScreen from '../Profile';

// Define tab page configuration type
type TabPage = {
  name: string;
  component: React.ComponentType<any>;
  icon: string;
  options?: {
    headerTitle?: string;
    headerShown?: boolean;
  };
};

// Tab configuration array
const TAB_PAGES: TabPage[] = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home-outline',
    options: {headerTitle: 'Home', headerShown: false},
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'person-outline',
    options: {headerTitle: 'Profile', headerShown: false},
  },
];

const Tab = createBottomTabNavigator();

// Memoized TabIcon component for better performance
const TabIcon = memo(
  ({name, color, size = 24}: {name: string; color: string; size?: number}) => (
    <Icon name={name} size={size} color={color} />
  ),
);

const Navbar = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#fff',
      }}>
      {TAB_PAGES.map(({name, component, icon, options}) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            ...options,
            tabBarIcon: ({color, size}) => (
              <TabIcon name={icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#333',
    paddingBottom: 5,
    height: 60,
    borderTopWidth: 0,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
});

export default memo(Navbar);
