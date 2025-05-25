import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';

const CreateEventScreen = () => {
  const { id } = useLocalSearchParams();
  const isEdit = !!id;
  const router = useRouter();

  const [form, setForm] = useState({
    team1: '',
    team2: '',
    date: '',
    time: '',
    venue: '',
    umpire: '',
    official: '',
  });

  const [teams, setTeams] = useState<string[]>([]);
  const [existingMatchups, setExistingMatchups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamSnapshot = await getDocs(collection(db, 'teams'));
        const teamNames = teamSnapshot.docs.map(doc => doc.data().name);
        setTeams(teamNames);

        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const matchups: string[] = [];
        eventsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          matchups.push(`${data.team1} vs ${data.team2}`);
          matchups.push(`${data.team2} vs ${data.team1}`);
        });
        setExistingMatchups(matchups);

        if (isEdit && typeof id === 'string') {
          const docRef = doc(db, 'events', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const eventData = docSnap.data();
            setForm({
              team1: eventData.team1,
              team2: eventData.team2,
              date: eventData.date,
              time: eventData.time,
              venue: eventData.venue,
              umpire: eventData.umpire ?? '',
              official: eventData.official ?? '',
            });
          } else {
            Alert.alert('Error', 'Event not found.');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setForm(prev => ({ ...prev, date: formattedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setForm(prev => ({ ...prev, time: `${hours}:${minutes}` }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.team1 || !form.team2 || !form.date || !form.time || !form.venue) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    if (form.team1 === form.team2) {
      Alert.alert('Validation Error', 'Team 1 and Team 2 cannot be the same.');
      return;
    }

    const matchupKey = `${form.team1} vs ${form.team2}`;
    if (!isEdit && existingMatchups.includes(matchupKey)) {
      Alert.alert('Duplicate Matchup', 'An event with these two teams already exists.');
      return;
    }

    Alert.alert(
      isEdit ? 'Confirm Event Update' : 'Confirm Event Creation',
      isEdit ? 'Are you sure you want to update this event?' : 'Are you sure you want to create this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isEdit ? 'Update' : 'Create',
          onPress: async () => {
            try {
              if (isEdit && typeof id === 'string') {
                const docRef = doc(db, 'events', id);
                await updateDoc(docRef, form);
                Alert.alert('Success', 'Event updated successfully!');
              } else {
                await addDoc(collection(db, 'events'), {
                  ...form,
                  timestamp: new Date(),
                });
                Alert.alert('Success', 'Event created successfully!');
                setExistingMatchups(prev => [...prev, matchupKey, `${form.team2} vs ${form.team1}`]);
                setForm({
                  team1: '',
                  team2: '',
                  date: '',
                  time: '',
                  venue: '',
                  umpire: '',
                  official: '',
                });
              }

              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', isEdit ? 'Failed to update event.' : 'Failed to create event.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>{isEdit ? 'Edit Event' : 'Create New Event'}</Text>

          <Text style={styles.label}>Team 1</Text>
          <Picker selectedValue={form.team1} onValueChange={value => handleChange('team1', value)}>
            <Picker.Item label="Select Team 1" value="" />
            {teams.map((team, index) => (
              <Picker.Item key={index} label={team} value={team} />
            ))}
          </Picker>

          <Text style={styles.label}>Team 2</Text>
          <Picker selectedValue={form.team2} onValueChange={value => handleChange('team2', value)}>
            <Picker.Item label="Select Team 2" value="" />
            {teams.map((team, index) => (
              <Picker.Item key={index} label={team} value={team} />
            ))}
          </Picker>

          <Text style={styles.label}>Date</Text>
          <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text>{form.date || 'Select Date'}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={form.date ? new Date(form.date) : new Date()}
              onChange={handleDateChange}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
            />
          )}

          <Text style={styles.label}>Time</Text>
          <Pressable onPress={() => setShowTimePicker(true)} style={styles.dateInput}>
            <Text>{form.time || 'Select Time'}</Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={form.time ? new Date(`1970-01-01T${form.time}:00`) : new Date()}
              onChange={handleTimeChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}

          <Text style={styles.label}>Venue</Text>
          <TextInput
            style={styles.input}
            value={form.venue}
            onChangeText={value => handleChange('venue', value)}
          />

          <Text style={styles.label}>Umpire</Text>
          <TextInput
            style={styles.input}
            value={form.umpire}
            onChangeText={value => handleChange('umpire', value)}
          />

          <Text style={styles.label}>Official</Text>
          <TextInput
            style={styles.input}
            value={form.official}
            onChangeText={value => handleChange('official', value)}
          />

          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <CustomButton
              title={isEdit ? 'Update Event' : 'Create Event'}
              onPress={handleSubmit}
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
});

export default CreateEventScreen;
