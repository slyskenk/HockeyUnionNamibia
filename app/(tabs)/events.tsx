import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Event {
    id: string;
    team1: string;
    team2: string;
    date: string;
    time: string;
    venue: string;
}

const EventsScreen = () => {
    const navigation = useNavigation();
    const [events, setEvents] = useState<Event[]>([]);

    const handleNewEvent = (newEvent: Omit<Event, 'id'>) => {
        setEvents(prevEvents => [...prevEvents, { id: Date.now().toString(), ...newEvent }]);
    };

    useEffect(() => {
        // In a real app, you might load initial events here
        const initialEvents: Event[] = [
            { id: 'initial1', team1: 'Initial Team A', team2: 'Initial Team B', date: '19/05/2025', time: '17:00', venue: 'Initial Venue' },
        ];
        setEvents(initialEvents);
    }, []);

    const renderItem = ({ item }: { item: Event }) => (
        <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>Hockey Match</Text>
            <View style={styles.teamsContainer}>
                <View style={styles.teamInfo}>
                    <Text style={styles.teamLabel}>TEAM 1</Text>
                    <Text style={styles.teamName}>{item.team1}</Text>
                </View>
                <Text style={styles.vsText}>vs</Text>
                <View style={styles.teamInfo}>
                    <Text style={styles.teamLabel}>TEAM 2</Text>
                    <Text style={styles.teamName}>{item.team2}</Text>
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>DATE</Text>
                    <Text style={styles.detailValue}>{item.date}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>TIME</Text>
                    <Text style={styles.detailValue}>{item.time}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>VENUE</Text>
                    <Text style={styles.detailValue}>{item.venue}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {events.length > 0 ? (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.eventsList}
                />
            ) : (
                <View style={styles.content}>
                    <Text style={styles.noEventsText}>NO EVENTS YET</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('createEvents', { onEventCreated: handleNewEvent })}
            >
                <Text style={styles.createButtonText}>Create new event</Text>
            </TouchableOpacity>

            <View style={styles.navigation}>
                <TouchableOpacity style={styles.navItem}>
                    <FontAwesome name="newspaper-o" size={24} color="gray" />
                    <Text style={styles.navText}>News</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noEventsText: {
        fontSize: 18,
        color: '#888',
    },
    eventsList: {
        padding: 10,
    },
    eventItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    teamsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    teamInfo: {
        alignItems: 'center',
    },
    teamLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 3,
    },
    teamName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    vsText: {
        fontSize: 16,
        color: '#555',
        fontWeight: 'bold',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 10,
        color: '#999',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 14,
        color: '#555',
    },
    createButton: {
        backgroundColor: '#0000FF',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
    },
});

export default EventsScreen;
