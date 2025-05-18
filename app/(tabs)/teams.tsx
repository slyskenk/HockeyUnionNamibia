import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define the Team type
interface Team {
    id: string;
    name: string;
    coach: string;
    logo: string | number; // Allow both URL string and require() for local images
}

// Dummy data for local teams - Replace with your actual data source
const localTeamsData: Team[] = [
    { id: 'wanderers', name: 'Wanderers', coach: 'Johan Weyhe', logo: require('../../assets/images/find_a_club/wanderers.png') }, // Local image
    { id: 'coastal-raiders', name: 'Coastal Raiders', coach: 'Melissa Gillies', logo: require( '../../assets/images/find_a_club/Coastal-Raidersr.png') }, // URL string
    { id: 'saints', name: 'Saints', coach: 'Erick DaCosta', logo: require('../../assets/images/find_a_club/Saints-Big.png') }, // Local
    { id: 'team-x', name: 'Team-X', coach: 'Kauna Musi', logo: require( '../../assets/images/find_a_club/Team-X.jpg') }, // URL
    { id: 'dts', name: 'DTS', coach: 'John Doe', logo: require('../../assets/images/find_a_club/DTS-01r.png') }, // Local
    { id: 'old-boys', name: 'Old Boys', coach: 'Jane Smith', logo: require( '../../assets/images/find_a_club/Old-Boys.jpg') }, // URL

];

const TeamsScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate data loading (e.g., from an API or database)
        const fetchData = async () => {
            try {
                // In a real app, you'd fetch data here
                // For this example, we'll just use the dummy data after a short delay
                setTimeout(() => {
                    setTeams(localTeamsData);
                    setLoading(false);
                }, 500); // Short delay, remove in production
            } catch (err: any) {
                setError(err.message || 'Failed to load teams data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

     const goToEditClub = (teamId: string) => {
        navigation.navigate('EditClub', { teamId });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading Teams...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity onPress={() => setError(null)}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Local Teams</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <MaterialCommunityIcons name="microphone-outline" size={24} color="#888" />
            </View>

            <View>
                {filteredTeams.map(team => (
                    <TouchableOpacity key={team.id} style={styles.teamCard}  onPress={() => goToEditClub(team.id)}>
                        <View style={styles.teamInfo}>
                            {/* Handle different logo types */}
                            {typeof team.logo === 'string' ? (
                                team.logo ? <Image source={{ uri: team.logo }} style={styles.teamLogo} /> :  <View style={styles.placeholderLogo} />
                            ) : team.logo ? (
                                <Image source={team.logo} style={styles.teamLogo} />
                            ) :  <View style={styles.placeholderLogo} />
                            }
                            <View>
                                <Text style={styles.teamName}>{team.name}</Text>
                                <Text style={styles.coach}>Current Coach: {team.coach || 'N/A'}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                 <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegisterClub')}>
                    <Text style={styles.buttonText}>Register a club</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => { }}>
                    <Text style={styles.buttonText}>Edit a club</Text>
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
        marginTop: 20,
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
        backgroundColor: '#f0f0f0',
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
    placeholderLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        backgroundColor: '#ddd', // Light gray placeholder
        alignItems: 'center',
        justifyContent: 'center',
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
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center'
    },
    retryText: {
        color: 'blue',
        fontSize: 16,
        textDecorationLine: 'underline',
    }
});

export default TeamsScreen;
