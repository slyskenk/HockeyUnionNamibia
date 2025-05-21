import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '../../components/CustomButton';

const CreateEventScreen = () => {
  const [form, setForm] = useState({
    team1: '',
    team2: '',
    date: '',
    time: '',
    venue: '',
    umpire: '',
    official: '',
    team1Logo: null,
    team2Logo: null,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async (team) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleChange(team, uri);
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Confirm Event Creation',
      'Are you sure you want to create this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: () => {
            console.log('Submitting form:', form);
            // TODO: Add Firebase Firestore logic here
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      {/* Team 1 Logo Upload */}
      <Text style={styles.label}>Team 1 Logo</Text>
      <Pressable
        onPress={() => pickImage('team1Logo')}
        style={styles.imagePickerContainer}
      >
        {form.team1Logo ? (
          <Image source={{ uri: form.team1Logo }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.plus}>+</Text>
          </View>
        )}
      </Pressable>

      {/* Team 2 Logo Upload */}
      <Text style={styles.label}>Team 2 Logo</Text>
      <Pressable
        onPress={() => pickImage('team2Logo')}
        style={styles.imagePickerContainer}
      >
        {form.team2Logo ? (
          <Image source={{ uri: form.team2Logo }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.plus}>+</Text>
          </View>
        )}
      </Pressable>

      {/* Form Fields */}
      {['team1', 'team2', 'date', 'time', 'venue', 'umpire', 'official'].map(
        (field, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>
              {field.replace(/^\w/, (c) => c.toUpperCase()).replace(/([A-Z])/g, ' $1')}
            </Text>
            <TextInput
              style={styles.input}
              value={form[field]}
              onChangeText={(text) => handleChange(field, text)}
              placeholder={field === 'date' ? 'DD/MM/YYYY' : ''}
            />
          </View>
        )
      )}

      <CustomButton title="Create new event" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#0F172A',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    color: '#64748B',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  imagePickerContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 36,
    color: '#94A3B8',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default CreateEventScreen;
