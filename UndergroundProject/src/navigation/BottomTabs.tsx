// BottomTabs.tsx (unchanged, minimal example)
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import QRScreen from '../screens/QRScreen';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type BottomTabParamList = {
  QR: undefined;
  Search:
    | {
        scannedCemeteryId?: string; // We'll pass this param from QR to Search
      }
    | undefined;
  Map: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => (
  <Tab.Navigator initialRouteName="QR">
    <Tab.Screen
      name="QR"
      component={QRScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="qrcode" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="search" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="map" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="cog" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

export default BottomTabs;
