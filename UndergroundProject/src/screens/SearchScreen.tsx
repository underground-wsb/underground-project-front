import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const SearchScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Search with Select Inputs</Text>
    {/* Replace with actual select components */}
    <Picker style={styles.picker}>
      <Picker.Item  label="Option 1" value="option1"/>
      <Picker.Item  label="Option 2" value="option2"/>
    </Picker>
    <Picker style={styles.picker}>
      <Picker.Item  label="Option A" value="optionA"/>
      <Picker.Item  label="Option B" value="optionB"/>
    </Picker>
    <Picker style={styles.picker}>
      <Picker.Item  label="Option X" value="optionX"/>
      <Picker.Item  label="Option Y" value="optionY"/>
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
  text: {fontSize: 20, marginBottom: 20},
  picker: {width: '100%', marginVertical: 10},
});

export default SearchScreen;
