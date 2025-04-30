// SearchScreen.tsx
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {View, Text, StyleSheet, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';

// For navigation
import {useNavigation, useRoute} from '@react-navigation/native';
import type {BottomTabParamList} from '../navigation/BottomTabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {MaterialBottomTabNavigationProp} from '@react-navigation/material-bottom-tabs';
// or from '@react-navigation/bottom-tabs' if you use bottom-tabs directly

// Because we're using bottom-tabs directly:
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export interface City {
  id: string;
  name: string;
  cemeteries: Cemetery[];
}

export interface DeadOne {
  id: string;
  name: string;
  surname: string;
  dateOfDeath: string;
  grave: string;
}

export interface Grave {
  id: string;
  latitude: string; // Ensure your data has these
  longitude: string; // Ensure your data has these
  deadOnes: DeadOne[];
  cemetery: Cemetery;
}

export interface Cemetery {
  id: string;
  name: string;
  cities: City[];
  graves: Grave[];
}

// For navigation with bottom-tabs:
type SearchScreenNavProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Search'
>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavProp>();

  // 1) Cities
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // 2) Cemeteries
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [selectedCemetery, setSelectedCemetery] = useState<string | null>(null);

  // 3) DeadOnes
  const [deadOnes, setDeadOnes] = useState<DeadOne[]>([]);
  const [selectedDeadOne, setSelectedDeadOne] = useState<string | null>(null);

  // Also store the full graves array to find lat/long
  const [graves, setGraves] = useState<Grave[]>([]);

  const route = useRoute();

  const {scannedCemeteryId} = route.params || {};
  console.log(scannedCemeteryId, 'scid');

const trySelectFromScan = () => {
  if (
    scannedCemeteryId &&
    cities.length > 0
  ) {
    console.log('Running selection logic');

    const destinationCity = cities.find(city =>
      city.cemeteries.some(cemetery => String(cemetery.id) === String(scannedCemeteryId)),
    );
    if (destinationCity) setSelectedCity(destinationCity.id);

    const destinationCemetery = cemeteries.find(
      cemetery => String(cemetery.id) === String(scannedCemeteryId),
    );
    if (destinationCemetery) setSelectedCemetery(destinationCemetery.id);
  }
};

// 1️⃣ Run once when everything loads
useEffect(() => {
  trySelectFromScan();
}, [scannedCemeteryId, cities, cemeteries]);

// 2️⃣ Re-run on screen refocus
useFocusEffect(
  useCallback(() => {
    trySelectFromScan();
  }, [scannedCemeteryId, cities, cemeteries])
);

//   ---------------------------------------------
//   Fetch Cities on mount
//   ---------------------------------------------
  useEffect(() => {
    fetch('http://192.168.0.101:3000/cities')
      .then(response => response.json())
      .then(data => {
        console.log('Cities fetched:', data);
        setCities(data);
      })
      .catch(error => console.error('Error fetching cities:', error));
  }, []);

  // ---------------------------------------------
  // Fetch Cemeteries when a City is selected
  // ---------------------------------------------
  useEffect(() => {
    if (selectedCity) {
      setSelectedCemetery(null);
      setDeadOnes([]);
      setSelectedDeadOne(null);
      setGraves([]);

      fetch(`http://192.168.0.101:3000/cemeteries?cityId=${selectedCity}`)
        .then(response => response.json())
        .then(data => setCemeteries(data))
        .catch(error => console.error('Error fetching cemeteries:', error));
    } else {
      setCemeteries([]);
      setSelectedCemetery(null);
      setDeadOnes([]);
      setSelectedDeadOne(null);
      setGraves([]);
    }
  }, [selectedCity]);

  // ---------------------------------------------
  // Fetch Graves (and deadOnes) when a Cemetery is selected
  // ---------------------------------------------
  useEffect(() => {
    if (selectedCemetery) {
      setDeadOnes([]);
      setSelectedDeadOne(null);
      setGraves([]);

      fetch(`http://192.168.0.101:3000/graves?cemeteryId=${selectedCemetery}`)
        .then(response => response.json())
        .then((gravesData: Grave[]) => {
          console.log('Graves data:', gravesData);
          setGraves(gravesData);
          const allDeadOnes = gravesData.flatMap(grave => grave.deadOnes || []);
          setDeadOnes(allDeadOnes);
        })
        .catch(error => console.error('Error fetching graves:', error));
    } else {
      setGraves([]);
      setDeadOnes([]);
      setSelectedDeadOne(null);
    }
  }, [selectedCemetery]);

  // ---------------------------------------------
  // Handle "Find" button
  // ---------------------------------------------
  const handleFind = () => {
    if (!selectedDeadOne) {
      console.warn('No deadOne selected');
      return;
    }

    // 1) Find the person
    const person = deadOnes.find(d => d.id === selectedDeadOne);
    if (!person) {
      console.warn('Selected deadOne not found in array');
      return;
    }

    // 2) Find the grave that contains this person
    const graveWithPerson = graves.find(grave =>
      grave.deadOnes.some(d => d.id === person.id),
    );

    if (!graveWithPerson) {
      console.warn('No grave found for selected person');
      return;
    }

    // 3) Navigate to Map tab, passing lat & lng
    navigation.navigate('Map', {
      latitude: graveWithPerson.latitude,
      longitude: graveWithPerson.longitude,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search with Select Inputs</Text>

      {/* 1) City Picker */}
      <Picker
        style={styles.picker}
        selectedValue={selectedCity}
        onValueChange={value => setSelectedCity(value)}
        enabled={cities.length > 0}>
        <Picker.Item label="Select a City" value={null} />
        {cities.map(city => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>

      {/* 2) Cemetery Picker */}
      <Picker
        style={styles.picker}
        selectedValue={selectedCemetery}
        onValueChange={value => setSelectedCemetery(value)}
        enabled={cemeteries.length > 0}>
        <Picker.Item label="Select a Cemetery" value={null} />
        {cemeteries.map(cemetery => (
          <Picker.Item
            key={cemetery.id}
            label={cemetery.name}
            value={cemetery.id}
          />
        ))}
      </Picker>

      {/* 3) DeadOne Picker */}
      <Picker
        style={styles.picker}
        selectedValue={selectedDeadOne}
        onValueChange={value => setSelectedDeadOne(value)}
        enabled={deadOnes.length > 0}>
        <Picker.Item label="Select a DeadOne" value={null} />
        {deadOnes.map(person => (
          <Picker.Item key={person.id} label={person.name} value={person.id} />
        ))}
      </Picker>

      {/* 4) "Find" Button */}
      {selectedDeadOne && <Button title="Find" onPress={handleFind} />}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {fontSize: 20, marginBottom: 20},
  picker: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#000',
  },
});
