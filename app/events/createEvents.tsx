import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker'; // Import the picker
import { Image } from 'react-native'; // import image

interface Event {
    eventName: string;
    team1: string;
    team2: string;
    date: string;
    time: string;
    location: string;
    umpire: string;
    technicalOfficial: string;
    description?: string; //make description optional
    image?: string;       //make image optional
}

const CreateEventScreen = () => {
    const navigation = useNavigation();
    const [event, setEvent] = useState<Event>({
        eventName: '',
        team1: '',
        team2: '',
        date: '',
        time: '',
        location: '',
        umpire: '',
        technicalOfficial: '',
        description: '',
        image: '',
    });
    const [pickerItems, setPickerItems] = useState({
        umpires: ['Umpire 1', 'Umpire 2', 'Umpire 3'],
        technicalOfficials: ['Technical Official 1', 'Technical Official 2', 'Technical Official 3'],
    })


    // Dummy data for umpires and technical officials
    const umpires = ['Umpire 1', 'Umpire 2', 'Umpire 3'];
    const technicalOfficials = ['Technical Official 1', 'Technical Official 2', 'Technical Official 3'];

    const handleInputChange = (field: keyof Event, value: string) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            [field]: value,
        }));
    };

    const handleCreateEvent = () => {
        // Implement your event creation logic here
        console.log('Event Name:', event.eventName);
        console.log('Team 1:', event.team1);
        console.log('Team 2:', event.team2);
        console.log('Date:', event.date);
        console.log('Time:', event.time);
        console.log('Location:', event.location);
        console.log('Umpire:', event.umpire);
        console.log('Technical Official', event.technicalOfficial);
        console.log('Description:', event.description);
        console.log('Image:', event.image);
        // After successful creation, you might want to navigate back
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Create New Event</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Event Name"
                    value={event.eventName}
                    onChangeText={(text) => handleInputChange('eventName', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Team 1"
                    value={event.team1}
                    onChangeText={(text) => handleInputChange('team1', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Team 2"
                    value={event.team2}
                    onChangeText={(text) => handleInputChange('team2', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date (DD/MM/YYYY)"
                    value={event.date}
                    onChangeText={(text) => handleInputChange('date', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Time (HH:MM)"
                    value={event.time}
                    onChangeText={(text) => handleInputChange('time', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={event.location}
                    onChangeText={(text) => handleInputChange('location', text)}
                />

                <Picker
                    selectedValue={event.umpire}
                    onValueChange={(itemValue) => handleInputChange('umpire', itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Umpire" value="" />
                    {pickerItems.umpires.map((umpire) => (
                        <Picker.Item key={umpire} label={umpire} value={umpire} />
                    ))}
                </Picker>

                <Picker
                    selectedValue={event.technicalOfficial}
                    onValueChange={(itemValue) => handleInputChange('technicalOfficial', itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Technical Official" value="" />
                    {pickerItems.technicalOfficials.map((official) => (
                        <Picker.Item key={official} label={official} value={official} />
                    ))}
                </Picker>

                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={event.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                    multiline
                    numberOfLines={4}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Image URL" //  Consider a file picker library
                    value={event.image}
                    onChangeText={(text) => handleInputChange('image', text)}
                />
                {event.image ? (
                    <Image source={{uri: event.image}} style={{width: 100, height: 100}} />
                ) : null
                }

                <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
                    <LinearGradient
                        colors={['#4CAF50', '#388E3C']} // Green gradient
                        style={styles.gradient}
                    >
                        <Text style={styles.createButtonText}>Create Event</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    formContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
    },
    picker: {
        height: 48,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
    },
    createButton: {
        borderRadius: 12,
        marginTop: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    gradient: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default CreateEventScreen;
