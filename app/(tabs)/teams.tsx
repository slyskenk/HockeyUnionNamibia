import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Dummy data for local teams - Replace with your actual data source
const localTeamsData = [
    { id: 'indoor-men-saints', name: 'Saints', coach: 'Johan Weyhe', logo: 'https://via.placeholder.com/50' }, // Replace with actual logo URLs
    { id: 'indoor-men-wanderers', name: 'Wanderers', coach: 'Melissa Gillies', logo: 'https://via.placeholder.com/50' },
    { id: 'indoor-women-saints', name: 'Saints Womens Team', coach: 'Johan Weyhe', logo: 'https://via.placeholder.com/50' },
    { id: 'indoor-women-wanderers', name: 'Wanderers Womens National Team', coach: 'Melissa Gillies', logo: 'https://via.placeholder.com/50' },
];

const LocalTeamsScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [teams, setTeams] = useState(localTeamsData); // State to hold the teams data

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // In a real app, you would filter the teams based on the search query
        const filteredTeams = localTeamsData.filter(team =>
            team.name.toLowerCase().includes(query.toLowerCase())
        );
        setTeams(filteredTeams);
    };

    const goToRegisterClub = () => {
        navigation.navigate('RegisterClub'); //  Make sure this route is defined
    };

    const goToEditClub = (teamId: string) => {
        navigation.navigate('EditClub', { teamId }); //  Make sure this route is defined and pass team ID
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Local Teams</Text>
                {/* Add a back button if this is a screen within a stack */}
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <MaterialCommunityIcons name="microphone-outline" size={24} color="#888" />
            </View>

            {/* Team Lists */}
            <View>
                {/* Indoor Men Premier */}
                <Text style={styles.sectionTitle}>Indoor Men Premier</Text>
                {teams
                    .filter(team => team.name.toLowerCase().includes('indoor men')) // Filter teams
                    .map(team => (
                        <TouchableOpacity key={team.id} style={styles.teamCard} onPress={() => goToEditClub(team.id)}>
                            <View style={styles.teamInfo}>
                                <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                                <View>
                                    <Text style={styles.teamName}>{team.name}</Text>
                                    <Text style={styles.coach}>Current Coach: {team.coach}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                {/* Indoor Women Premier */}
                <Text style={styles.sectionTitle}>Indoor Women Premier</Text>
                {teams
                    .filter(team => team.name.toLowerCase().includes('indoor women'))
                    .map(team => (
                        <TouchableOpacity key={team.id} style={styles.teamCard} onPress={() => goToEditClub(team.id)}>
                            <View style={styles.teamInfo}>
                                <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                                <View>
                                    <Text style={styles.teamName}>{team.name}</Text>
                                    <Text style={styles.coach}>Current Coach: {team.coach}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.registerButton} onPress={goToRegisterClub}>
                    <LinearGradient
                        colors={['#4a148c', '#1a237e']} //  purple gradient
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Register a club</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => {}}>
                    <LinearGradient
                        colors={['#007BFF', '#0040FF']} // Blue gradient
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Edit a club</Text>
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
        marginTop: 20, // Add space for status bar
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0', // Light background for search bar
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    teamCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    teamLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    teamName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    coach: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        marginTop: 20,
    },
    registerButton: {
        flex: 1,
        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    editButton: {
        flex: 1,
        marginLeft: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradient: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default LocalTeamsScreen;
