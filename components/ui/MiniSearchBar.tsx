import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  query: string;
  onChangeText: (text: string) => void;
};

const MiniSearchBar: React.FC<Props> = ({ query, onChangeText }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color="#666" />
      <TextInput
        style={styles.input}
        placeholder="Search bookmarks..."
        placeholderTextColor="#666"
        value={query}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default MiniSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f0ff',
    padding: 10,
    borderRadius: 10,
    margin: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});
