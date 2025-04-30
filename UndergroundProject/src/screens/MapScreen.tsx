import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';
import {useRoute, RouteProp} from '@react-navigation/native';
import {BottomTabParamList} from '../navigation/BottomTabs';

// Type for navigation route
type MapRouteProps = RouteProp<BottomTabParamList, 'Map'>;

// Request location permission with rationale
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'This app needs access to your location to show your position on the map.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Permission request error:', err);
    return false;
  }
};

const MapScreen = () => {
  const route = useRoute<MapRouteProps>();
  const graveLatitude = route.params?.latitude;
  const graveLongitude = route.params?.longitude;

  const [styleJSON, setStyleJSON] = useState<any>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    let watchId: number;

    const getUserLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission denied.');
        return;
      }

      // 1. Get initial location
      Geolocation.getCurrentPosition(
        position => {
          console.log('Initial user location:', position.coords);
          const {latitude, longitude} = position.coords;
          setUserCoords([longitude, latitude]);
        },
        error => {
          console.warn('Initial position error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 1000,
        }
      );

      // 2. Start watching location updates
      watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setUserCoords([longitude, latitude]);
        },
        error => {
          console.warn('Watch position error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 2000,
          fastestInterval: 1000,
        }
      );
    };

    getUserLocation();

    return () => {
      if (watchId != null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Fetch map style JSON
  useEffect(() => {
    const fetchStyle = async () => {
      const styleUrl =
        'https://api.maptiler.com/maps/satellite/style.json?key=3Jz5zcPbHDTVRXqUO9yM';

      try {
        const response = await fetch(styleUrl);
        if (!response.ok) {
          throw new Error(
            `Style request failed with status ${response.status}`
          );
        }
        const data = await response.json();
        setStyleJSON(data);
      } catch (error) {
        console.error('Error fetching style JSON:', error);
      }
    };

    fetchStyle();
  }, []);

  return (
    <View style={styles.container}>
      {styleJSON && (
        <MapLibreGL.MapView style={styles.map} mapStyle={styleJSON}>
          {/* Camera & user location */}
          {userCoords && (
            <>
              <MapLibreGL.Camera
                zoomLevel={18}
                centerCoordinate={userCoords}
                animationMode="flyTo"
                animationDuration={1000}
              />
              <MapLibreGL.PointAnnotation
                coordinate={userCoords}
                id="userLocation">
                <View style={styles.userMarker}>
                  <Text style={styles.userMarkerText}>You</Text>
                </View>
              </MapLibreGL.PointAnnotation>
            </>
          )}

          {/* Grave marker */}
          {graveLatitude && graveLongitude && (
            <MapLibreGL.PointAnnotation
              id="graveLocation"
              coordinate={[
                parseFloat(graveLongitude),
                parseFloat(graveLatitude),
              ]}
            />
          )}
        </MapLibreGL.MapView>
      )}

      {userCoords && (
        <View style={styles.overlay} pointerEvents="none">
          <Text>Lat: {userCoords[1].toFixed(6)}</Text>
          <Text>Lng: {userCoords[0].toFixed(6)}</Text>
        </View>
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  overlay: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userMarker: {
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
