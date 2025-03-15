import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

const MapScreen = () => {
  return (
    <View style={styles.container}>
         <MapLibreGL.MapView style={{ flex: 1 }}>
            <MapLibreGL.Camera zoomLevel={14} centerCoordinate={[-122.4324, 37.78825]} />
          </MapLibreGL.MapView>
  </View>
  )
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
});

export default MapScreen;
