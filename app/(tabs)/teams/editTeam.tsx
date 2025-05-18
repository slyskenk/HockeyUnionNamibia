import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Dummy data for players - Replace with your actual data source and types
interface Player {
    id: string;
    name: string;
    position: string;
    captain: boolean;
    number: number;
    image: string; // Added image field
}

interface Team {
    id: string;
    name: string;
    logo: string;
    players: Player[];
}

const EditTeamScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { teamId } = route.params as { teamId: string }; // Get the teamId

    // Dummy data for the team.  Replace with actual data fetching.
    const [team, setTeam] = useState<Team | null>(null);
    const [squad, setSquad] = useState<Player[]>([]);
    const [substitutes, setSubstitutes] = useState<Player[]>([]);
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [selectedPlayerToAdd, setSelectedPlayerToAdd] = useState<string | null>(null);


    useEffect(() => {
        // Fetch team data based on teamId.  Replace this with your actual data fetching.
        const fetchedTeam: Team | undefined = {
            id: teamId,
            name: 'Saints', //  Replace with actual team name
            logo: 'https://via.placeholder.com/50', // Replace with actual logo URL
            players: [
                { id: '1', name: 'Erling Haaland', position: 'Goalkeeper', captain: false, number: 1, image: 'https://via.placeholder.com/50' },
                { id: '2', name: 'Player 2', position: 'Defender', captain: false, number: 2, image: 'https://via.placeholder.com/50' },
                { id: '3', name: 'Player 3', position: 'Midfielder', captain: false, number: 3, image: 'https://via.placeholder.com/50' },
                { id: '4', name: 'Player 4', position: 'Forward', captain: false, number: 4, image: 'https://via.placeholder.com/50' },
                { id: '5', name: 'Player 5', position: 'Goalkeeper', captain: false, number: 5, image: 'https://via.placeholder.com/50' },
                { id: '6', name: 'Player 6', position: 'Defender', captain: false, number: 6, image: 'https://via.placeholder.com/50' },
            ],
        };

        if (fetchedTeam) {
            setTeam(fetchedTeam);
            setSquad(fetchedTeam.players.slice(0, 3)); // Example: First 3 as squad
            setSubstitutes(fetchedTeam.players.slice(3)); // Example: Rest as subs
            setAvailablePlayers(fetchedTeam.players);
        } else {
            // Handle the case where the team is not found (e.g., show an error)
            Alert.alert('Team Not Found', 'Could not find team with ID: ' + teamId);
            navigation.goBack();
        }
    }, [teamId, navigation]);



    const handleAddPlayerToSquad = () => {
        if (selectedPlayerToAdd) {
            const playerToAdd = availablePlayers.find(p => p.id === selectedPlayerToAdd);
            if (playerToAdd) {
                if (squad.length < 11) { //max of 11 players
                    setSquad(prevSquad => [...prevSquad, playerToAdd]);
                    setAvailablePlayers(prevPlayers => prevPlayers.filter(p => p.id !== selectedPlayerToAdd));
                    setSelectedPlayerToAdd(null);
                }
                else {
                    Alert.alert("Squad Full", "You can't add more players to the starting squad.");
                }

            }
        }
    };

    const handleAddPlayerToSubs = () => {
        if (selectedPlayerToAdd) {
            const playerToAdd = availablePlayers.find(p => p.id === selectedPlayerToAdd);
            if (playerToAdd) {
                if (substitutes.length < 5) { //max of 5 subs
                    setSubstitutes(prevSubs => [...prevSubs, playerToAdd]);
                    setAvailablePlayers(prevPlayers => prevPlayers.filter(p => p.id !== selectedPlayerToAdd));
                    setSelectedPlayerToAdd(null);
                }
                else {
                    Alert.alert("Subs Full", "You can't add more players to the substitutes.");
                }

            }
        }
    };


    const handleRemovePlayer = (playerId: string, from: 'squad' | 'substitutes') => {
        Alert.alert(
            "Remove Player",
            "Are you sure you want to remove this player?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => {
                        if (from === 'squad') {
                            const removedPlayer = squad.find(p => p.id === playerId);
                            setSquad(prevSquad => prevSquad.filter(p => p.id !== playerId));
                            if (removedPlayer) {
                                setAvailablePlayers(prev => [...prev, removedPlayer])
                            }

                        } else {
                            const removedPlayer = substitutes.find(p => p.id === playerId);
                            setSubstitutes(prevSubs => prevSubs.filter(p => p.id !== playerId));
                            if (removedPlayer) {
                                setAvailablePlayers(prev => [...prev, removedPlayer])
                            }
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const handleSaveChanges = () => {
        // Implement the logic to save the changes to the team's squad
        console.log('Squad:', squad);
        console.log('Substitutes:', substitutes);
        //  Update your data source
        navigation.goBack(); // Go back after saving
    };

    if (!team) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{team.name}</Text>
                <MaterialCommunityIcons name="share-outline" size={24} color="black" />
                <TouchableOpacity>
                    <MaterialCommunityIcons name="star-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.logoContainer}>
                <Image source={{ uri: team.logo }} style={styles.teamLogo} />
            </View>

            <Text style={styles.squadTitle}>Edit Squad</Text>

            {/* Squad List */}
            {squad.map((player) => (
                <View key={player.id} style={styles.playerRow}>
                    <Image source={{ uri: player.image }} style={styles.playerImage} />
                    <Text style={styles.playerNumber}>{player.number}</Text>
                    <View style={styles.playerInfo}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.playerPosition}>{player.position}</Text>
                    </View>

                    <Text style={styles.playerCaptain}>{player.captain ? 'Cap' : ''}</Text>
                    <TouchableOpacity onPress={() => handleRemovePlayer(player.id, 'squad')} style={styles.removeButton}>
                        <MaterialCommunityIcons name="close" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            ))}

            <Text style={styles.substitutesTitle}>Substitutes</Text>
            {substitutes.map((player) => (
                <View key={player.id} style={styles.playerRow}>
                    <Image source={{ uri: player.image }} style={styles.playerImage} />
                    <Text style={styles.playerNumber}>{player.number}</Text>
                    <View style={styles.playerInfo}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.playerPosition}>{player.position}</Text>
                    </View>
                    <Text style={styles.playerCaptain}>{player.captain ? 'Cap' : ''}</Text>
                    <TouchableOpacity onPress={() => handleRemovePlayer(player.id, 'substitutes')} style={styles.removeButton}>
                        <MaterialCommunityIcons name="close" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            ))}
            <Picker
                selectedValue={selectedPlayerToAdd}
                onValueChange={(itemValue) => setSelectedPlayerToAdd(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select Player to Add" value={null} />
                {availablePlayers.map((player) => (
                    <Picker.Item key={player.id} label={player.name} value={player.id} />
                ))}
            </Picker>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addPlayerButton} onPress={handleAddPlayerToSquad}>
                    <LinearGradient
                        colors={['#4CAF50', '#388E3C']} // Green gradient
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Add to Squad</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addPlayerButton} onPress={handleAddPlayerToSubs}>
                    <LinearGradient
                        colors={['#4CAF50', '#388E3C']} // Green gradient
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Add to Subs</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveChangesButton} onPress={handleSaveChanges}>
                <LinearGradient
                    colors={['#007BFF', '#0040FF']} // Blue gradient
                    style={styles.gradient}
                >
                    <Text style={styles.buttonText}>Save Changes</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    logoContainer: {
        alignItems: 'center',
        padding: 20,
    },
    teamLogo: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    squadTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    playerImage: {
        width: 40,  // Adjust size as needed
        height: 40, // Adjust size as needed
        borderRadius: 20,
        marginRight: 16,
    },
    playerNumber: {
        fontSize: 16,
        color: '#333',
        marginRight: 16,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    playerPosition: {
        fontSize: 14,
        color: '#666'
    },
    playerCaptain: {
        fontSize: 16,
        color: '#007BFF', // Blue for captain
        marginRight: 16,
    },
    substitutesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        paddingHorizontal: 16,
        marginTop: 30,
        marginBottom: 10,
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
        marginHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        marginTop: 20,
    },
    addPlayerButton: {
        flex: 1,
        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    removePlayerButton: {
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
    saveChangesButton: {
        marginHorizontal: 16,
        marginTop: 30,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20
    },
    removeButton: {
        padding: 5,
    }
});

export default EditTeamScreen;

