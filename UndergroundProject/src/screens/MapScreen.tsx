import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Text } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from '@react-native-community/geolocation';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const MapScreen = () => {
  // 1. Declare your state for styleJSON
  const [styleJSON, setStyleJSON] = useState<any>(null);
  console.log(styleJSON, 'sj');

  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission denied.');
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserCoords([longitude, latitude]);
        },
        error => console.warn(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      const watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserCoords([longitude, latitude]);
        },
        error => console.warn(error),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );

      return () => Geolocation.clearWatch(watchId);
    };

    getUserLocation();
  }, []);

  // 2. Fetch the style JSON manually
  useEffect(() => {
    const fetchStyle = async () => {
      const styleUrl =
        'https://api.maptiler.com/maps/satellite/style.json?key=3Jz5zcPbHDTVRXqUO9yM';

      try {
        const response = await fetch(styleUrl);
        if (!response.ok) {
          throw new Error(`Style request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched style JSON:', data);

        // 3. Use the setter from useState
        setStyleJSON(data);
      } catch (error) {
        console.error('Error fetching style JSON:', error);
      }
    };

    fetchStyle();
  }, []);

  return (
    <View style={styles.container}>
      {/* 4. Only render MapView after styleJSON is loaded */}
      {styleJSON && (
        <MapLibreGL.MapView style={styles.map} mapStyle={styleJSON}>
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
                id="userLocation"
              />
            </>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

     overlay: {
       position: 'absolute',
       top: 20,
       left: 10,
       backgroundColor: 'white',
       paddingHorizontal: 8,
       paddingVertical: 4,
       borderRadius: 4,
       // pointerEvents='none' in the component prevents blocking map
       // Optionally add a shadow on Android:
       elevation: 2,
       // or shadow on iOS:
       shadowColor: '#000',
       shadowOpacity: 0.2,
       shadowRadius: 2,
     },
});

export default MapScreen;
