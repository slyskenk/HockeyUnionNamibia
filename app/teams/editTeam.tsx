import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define Player interface (consistent with RegisterTeamScreen's Player interface)
interface Player {
    id: string;
    name: string;
    kitNumber: string;
    position: string;
    dob: string;
    caps: string;
    image?: string; // Optional player image (URI)
}

// Define Team interface for EditTeamScreen (more comprehensive)
interface Team {
    id: string;
    name: string;
    logo: string; // Logo will be a URI string
    contactPerson: string; // From RegisterTeamScreen
    contactPersonCellNumber: string;
    contactPersonEmail: string;
    nominatedUmpireName: string;
    nominatedUmpireCellphoneNumber: string;
    premierDivision: boolean;
    termsAndConditions: boolean;
    idea?: string;
    players: Player[]; // Full list of players for this team
}

// Define the type for the navigation parameters.
type RootStackParamList = {
    TeamsScreen: { newTeam?: Team } | undefined;
    EditTeamScreen: { teamId: string; teamData?: Team }; // teamData is optional when navigating to edit
};

type EditTeamScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditTeamScreen'>;

const { width } = Dimensions.get('window'); // Get screen width for responsive modal

const EditTeamScreen = () => {
    const navigation = useNavigation<EditTeamScreenNavigationProp>();
    const route = useRoute();
    const { teamId, teamData: initialTeamData } = route.params as RootStackParamList['EditTeamScreen'];

    const [team, setTeam] = useState<Team | null>(null);
    const [teamName, setTeamName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPersonCellNumber, setContactPersonCellNumber] = useState('');
    const [contactPersonEmail, setContactPersonEmail] = useState('');
    const [nominatedUmpireName, setNominatedUmpireName] = useState('');
    const [nominatedUmpireCellphoneNumber, setNominatedUmpireCellphoneNumber] = useState('');
    const [premierDivision, setPremierDivision] = useState(false);
    const [termsAndConditions, setTermsAndConditions] = useState(false);
    const [idea, setIdea] = useState('');
    const [currentLogo, setCurrentLogo] = useState<string | null>(null); // State for the team logo being edited

    const [players, setPlayers] = useState<Player[]>([]); // All players for this team
    const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id'>>({
        name: '',
        kitNumber: '',
        position: '',
        dob: '',
        caps: '',
    });
    const [emailError, setEmailError] = useState<string | null>(null);
    const [playerAddedMessage, setPlayerAddedMessage] = useState<string | null>(null);
    const playerMessageAnim = useRef(new Animated.Value(0)).current;
    const playerNameInputRef = useRef<TextInput>(null);

    // State for player editing modal
    const [isEditingPlayer, setIsEditingPlayer] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [editingPlayerImage, setEditingPlayerImage] = useState<string | null>(null);


    useEffect(() => {
        let fetchedTeam: Team | undefined;

        if (initialTeamData) {
            fetchedTeam = initialTeamData;
        } else {
            // Dummy data for an existing team if not coming from registration
            // This would be replaced by actual data fetching for an existing team
            fetchedTeam = {
                id: teamId,
                name: 'Existing Team Example',
                logo: 'https://placehold.co/100x100/ADD8E6/000000?text=Logo', // Example URL
                contactPerson: 'Existing Coach',
                contactPersonCellNumber: '0811234567',
                contactPersonEmail: 'coach@example.com',
                nominatedUmpireName: 'Umpire Existing',
                nominatedUmpireCellphoneNumber: '0817654321',
                premierDivision: true,
                termsAndConditions: true,
                idea: 'Existing team idea.',
                players: [
                    { id: 'p1', name: 'Erling Haaland', kitNumber: '9', position: 'Striker', dob: '21/07/2000', caps: '100', image: 'https://placehold.co/50x50/FFD700/000000?text=EH' },
                    { id: 'p2', name: 'Kevin De Bruyne', kitNumber: '17', position: 'Midfielder', dob: '28/06/1991', caps: '95', image: 'https://placehold.co/50x50/C0C0C0/000000?text=KD' },
                    { id: 'p3', name: 'Ruben Dias', kitNumber: '3', position: 'Defender', dob: '14/05/1997', caps: '70', image: 'https://placehold.co/50x50/A9A9A9/000000?text=RD' },
                ],
            };
        }

        if (fetchedTeam) {
            setTeam(fetchedTeam);
            setTeamName(fetchedTeam.name);
            setContactPerson(fetchedTeam.contactPerson);
            setContactPersonCellNumber(fetchedTeam.contactPersonCellNumber);
            setContactPersonEmail(fetchedTeam.contactPersonEmail);
            setNominatedUmpireName(fetchedTeam.nominatedUmpireName);
            setNominatedUmpireCellphoneNumber(fetchedTeam.nominatedUmpireCellphoneNumber);
            setPremierDivision(fetchedTeam.premierDivision);
            setTermsAndConditions(fetchedTeam.termsAndConditions);
            setIdea(fetchedTeam.idea || '');
            setCurrentLogo(fetchedTeam.logo);
            setPlayers(fetchedTeam.players || []); // Ensure players array is initialized
        } else {
            Alert.alert('Team Not Found', 'Could not find team with ID: ' + teamId);
            navigation.goBack();
        }
    }, [teamId, navigation, initialTeamData]);

    const handleTeamInputChange = useCallback((field: keyof Omit<Team, 'id' | 'logo' | 'players'>, value: string | boolean) => {
        if (field === 'name') setTeamName(value as string);
        else if (field === 'contactPerson') setContactPerson(value as string);
        else if (field === 'contactPersonCellNumber') setContactPersonCellNumber(value as string);
        else if (field === 'contactPersonEmail') {
            setContactPersonEmail(value as string);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof value === 'string' && value && !emailRegex.test(value)) {
                setEmailError('Please, enter a valid email address');
            } else {
                setEmailError(null);
            }
        }
        else if (field === 'nominatedUmpireName') setNominatedUmpireName(value as string);
        else if (field === 'nominatedUmpireCellphoneNumber') setNominatedUmpireCellphoneNumber(value as string);
        else if (field === 'premierDivision') setPremierDivision(value as boolean);
        else if (field === 'termsAndConditions') setTermsAndConditions(value as boolean);
        else if (field === 'idea') setIdea(value as string);
    }, []);

    const handleNewPlayerInputChange = useCallback((field: keyof Omit<Player, 'id'>, value: string) => {
        setNewPlayer(prevPlayer => ({
            ...prevPlayer,
            [field]: value,
        }));
    }, []);

    const handleAddPlayer = useCallback(() => {
        if (!newPlayer.name || !newPlayer.kitNumber || !newPlayer.position || !newPlayer.dob || !newPlayer.caps) {
            Alert.alert('Player Details Missing', 'Please fill in all player details.');
            return;
        }
        if (isNaN(Number(newPlayer.kitNumber)) || isNaN(Number(newPlayer.caps))) {
            Alert.alert('Invalid Input', 'Kit Number and Caps must be numbers.');
            return;
        }

        const playerWithId: Player = {
            ...newPlayer,
            id: `player-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            image: `https://placehold.co/50x50/CCCCCC/000000?text=${newPlayer.name.charAt(0)}`, // Generic placeholder
        };

        setPlayers(prevPlayers => [...prevPlayers, playerWithId]);
        setNewPlayer({ name: '', kitNumber: '', position: '', dob: '', caps: '' });

        setPlayerAddedMessage(`'${playerWithId.name}' added to squad!`);
        Animated.timing(playerMessageAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(playerMessageAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setPlayerAddedMessage(null));
            }, 1500);
        });
        playerNameInputRef.current?.focus();
    }, [newPlayer, playerMessageAnim]);


    const handleRemovePlayer = useCallback((playerId: string) => {
        Alert.alert(
            "Remove Player",
            "Are you sure you want to remove this player from the squad?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    onPress: () => {
                        setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));
                    }
                }
            ],
            { cancelable: false }
        );
    }, []);

    const pickTeamLogo = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a logo.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setCurrentLogo(result.assets[0].uri);
        }
    }, []);

    const pickPlayerImage = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a player image.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Square aspect ratio for player images
            quality: 1,
        });

        if (!result.canceled) {
            setEditingPlayerImage(result.assets[0].uri);
        }
    }, []);


    const handleSaveChanges = useCallback(() => {
        if (emailError) {
            Alert.alert('Validation Error', 'Please fix the email error before saving.');
            return;
        }
        if (!teamName || !contactPerson || !contactPersonCellNumber || !contactPersonEmail || !nominatedUmpireName || !nominatedUmpireCellphoneNumber) {
            Alert.alert('Validation Error', 'Please fill in all required team details.');
            return;
        }
        if (players.length === 0) {
            Alert.alert('Validation Error', 'Please add at least one player to the team.');
            return;
        }

        const updatedTeam: Team = {
            id: team?.id || `team-${Date.now()}`, // Use existing ID or generate new if somehow missing
            name: teamName,
            logo: currentLogo || 'https://placehold.co/100x100/ADD8E6/000000?text=Logo',
            contactPerson: contactPerson,
            contactPersonCellNumber: contactPersonCellNumber,
            contactPersonEmail: contactPersonEmail,
            nominatedUmpireName: nominatedUmpireName,
            nominatedUmpireCellphoneNumber: nominatedUmpireCellphoneNumber,
            premierDivision: premierDivision,
            termsAndConditions: termsAndConditions,
            idea: idea,
            players: players,
        };

        console.log('Saving Updated Team Data:', updatedTeam);
        // In a real application, you would send `updatedTeam` to your backend/database here.

        Alert.alert('Success', 'Team changes saved successfully!');
        navigation.goBack(); // Go back after saving
    }, [
        emailError, teamName, contactPerson, contactPersonCellNumber, contactPersonEmail,
        nominatedUmpireName, nominatedUmpireCellphoneNumber, premierDivision,
        termsAndConditions, idea, players, currentLogo, navigation, team?.id
    ]);

    // Handle editing an existing player
    const handleEditPlayerSubmit = useCallback(() => {
        if (!editingPlayer) return;

        // Basic validation for player fields in modal
        if (!editingPlayer.name || !editingPlayer.kitNumber || !editingPlayer.position || !editingPlayer.dob || !editingPlayer.caps) {
            Alert.alert('Player Details Missing', 'Please fill in all player details.');
            return;
        }
        if (isNaN(Number(editingPlayer.kitNumber)) || isNaN(Number(editingPlayer.caps))) {
            Alert.alert('Invalid Input', 'Kit Number and Caps must be numbers.');
            return;
        }

        setPlayers(prevPlayers => prevPlayers.map(player =>
            player.id === editingPlayer.id
                ? { ...editingPlayer, image: editingPlayerImage || editingPlayer.image } // Update image if changed
                : player
        ));
        setIsEditingPlayer(false); // Close modal
        setEditingPlayer(null); // Clear editing player
        setEditingPlayerImage(null); // Clear editing player image
    }, [editingPlayer, editingPlayerImage]);

    const handleCancelEditPlayer = useCallback(() => {
        setIsEditingPlayer(false);
        setEditingPlayer(null);
        setEditingPlayerImage(null);
    }, []);


    if (!team) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading Team Data...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit {team.name}</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <MaterialCommunityIcons name="share-variant" size={24} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <MaterialCommunityIcons name="star-outline" size={24} color="#555" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.formSection}>
                <Text style={styles.sectionHeading}>Club Details</Text>
                <View style={styles.logoUploadSection}>
                    <TouchableOpacity onPress={pickTeamLogo}>
                        <Image source={{ uri: currentLogo || 'https://placehold.co/120x120/CCCCCC/000000?text=Logo' }} style={styles.teamLogo} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.changeLogoButton} onPress={pickTeamLogo}>
                        <Text style={styles.changeLogoButtonText}>Change Club Logo</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Club Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter club name"
                    value={teamName}
                    onChangeText={(text) => handleTeamInputChange('name', text)}
                />
                <Text style={styles.inputLabel}>Club Contact Person</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter contact person's full name"
                    value={contactPerson}
                    onChangeText={(text) => handleTeamInputChange('contactPerson', text)}
                />
                <Text style={styles.inputLabel}>Contact Person Cell Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., +264 81 123 4567"
                    value={contactPersonCellNumber}
                    onChangeText={(text) => handleTeamInputChange('contactPersonCellNumber', text)}
                    keyboardType="phone-pad"
                />
                <Text style={styles.inputLabel}>Contact Person Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., email@example.com"
                    value={contactPersonEmail}
                    onChangeText={(text) => handleTeamInputChange('contactPersonEmail', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <Text style={styles.inputLabel}>Nominated Umpire Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter umpire's full name"
                    value={nominatedUmpireName}
                    onChangeText={(text) => handleTeamInputChange('nominatedUmpireName', text)}
                />
                <Text style={styles.inputLabel}>Nominated Umpire Cellphone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., +264 81 123 4567"
                    value={nominatedUmpireCellphoneNumber}
                    onChangeText={(text) => handleTeamInputChange('nominatedUmpireCellphoneNumber', text)}
                    keyboardType="phone-pad"
                />
                <Text style={styles.inputLabel}>Tell us about your idea</Text>
                <TextInput
                    style={styles.inputMultiline}
                    placeholder="Any additional information or ideas for your club..."
                    value={idea}
                    onChangeText={(text) => handleTeamInputChange('idea', text)}
                    multiline={true}
                    numberOfLines={4}
                />

                {/* Premier Division Checkbox */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleTeamInputChange('premierDivision', !premierDivision)}
                >
                    <View style={[
                        styles.checkbox,
                        premierDivision && styles.checkboxChecked,
                    ]} />
                    <Text style={styles.checkboxLabel}>Premier Division</Text>
                </TouchableOpacity>
            </View>

            {/* Squad Builder Section */}
            <View style={styles.squadBuilderSection}>
                <Text style={styles.sectionHeading}>Squad Builder</Text>
                <Text style={styles.inputLabel}>Player Name</Text>
                <TextInput
                    ref={playerNameInputRef}
                    style={styles.input}
                    placeholder="e.g., Erling Haaland"
                    value={newPlayer.name}
                    onChangeText={(text) => handleNewPlayerInputChange('name', text)}
                />
                <Text style={styles.inputLabel}>Kit Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 9"
                    value={newPlayer.kitNumber}
                    onChangeText={(text) => handleNewPlayerInputChange('kitNumber', text)}
                    keyboardType="numeric"
                />
                <Text style={styles.inputLabel}>Position</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Striker, Goalkeeper"
                    value={newPlayer.position}
                    onChangeText={(text) => handleNewPlayerInputChange('position', text)}
                />
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    value={newPlayer.dob}
                    onChangeText={(text) => handleNewPlayerInputChange('dob', text)}
                />
                <Text style={styles.inputLabel}>Caps (Number of Games)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 34"
                    value={newPlayer.caps}
                    onChangeText={(text) => handleNewPlayerInputChange('caps', text)}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.addPlayerButton} onPress={handleAddPlayer}>
                    <LinearGradient
                        colors={['#246BFD', '#0C0C69']}
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Add Player to Squad</Text>
                    </LinearGradient>
                </TouchableOpacity>
                {playerAddedMessage && (
                    <Animated.Text style={[styles.playerAddedFeedback, { opacity: playerMessageAnim }]}>
                        {playerAddedMessage}
                    </Animated.Text>
                )}

                {players.length > 0 && (
                    <View style={styles.playerListContainer}>
                        <Text style={styles.sectionTitle}>Current Squad ({players.length} Players)</Text>
                        <View style={styles.playerListHeader}>
                            <Text style={[styles.playerListHeaderText, styles.playerListNumberHeader]}>#</Text>
                            <Text style={[styles.playerListHeaderText, styles.playerListPlayerNameHeader]}>Player</Text>
                            <Text style={[styles.playerListHeaderText, styles.playerListCapsHeader]}>Caps</Text>
                            <View style={{ width: 24 }} /> {/* Placeholder for delete icon */}
                        </View>
                        <FlatList
                            data={players}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={styles.playerListItem}
                                    onPress={() => { setEditingPlayer(item); setEditingPlayerImage(item.image || null); setIsEditingPlayer(true); }}
                                >
                                    <Text style={styles.playerListNumber}>{index + 1}</Text>
                                    <Image source={{ uri: item.image || `https://placehold.co/50x50/CCCCCC/000000?text=${item.name.charAt(0)}` }} style={styles.playerImage} />
                                    <View style={styles.playerListItemDetails}>
                                        <Text style={styles.playerListItemName}>{item.name}</Text>
                                        <Text style={styles.playerListItemPosition}>{item.position}</Text>
                                    </View>
                                    <Text style={styles.playerListItemCaps}>{item.caps}</Text>
                                    <TouchableOpacity onPress={() => handleRemovePlayer(item.id)} style={styles.deletePlayerButton}>
                                        <MaterialIcons name="delete-forever" size={24} color="#E91E63" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )}
                            scrollEnabled={false} // Disable FlatList scrolling to prevent nesting issues
                        />
                    </View>
                )}
            </View>

            {/* Terms and Conditions Checkbox */}
            <View style={styles.formSection}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleTeamInputChange('termsAndConditions', !termsAndConditions)}
                >
                    <View style={[
                        styles.checkbox,
                        termsAndConditions && styles.checkboxChecked,
                    ]} />
                    <Text style={styles.checkboxLabel}>Tc's and C's</Text>
                </TouchableOpacity>
            </View>


            {/* Save Changes Button */}
            <TouchableOpacity style={styles.saveChangesButton} onPress={handleSaveChanges}>
                <LinearGradient
                    colors={['#246BFD', '#0C0C69']} // Blue gradient
                    style={styles.gradient}
                >
                    <Text style={styles.buttonText}>SAVE CHANGES</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Offices Information */}
            <View style={styles.officesContainer}>
                <Text style={styles.officesTitle}>Offices</Text>
                <Text style={styles.officesAddress}>Cricket Street, Windhoek, Namibia 9000.</Text>
                <Text style={styles.officesAddress}>They also have a PO Box address: PO Box 25799, Post Street Mall Windhoek, Namibia 9000</Text>
            </View>

            {/* Edit Player Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isEditingPlayer}
                onRequestClose={handleCancelEditPlayer}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Player</Text>

                        <TouchableOpacity style={styles.playerImageUploadContainer} onPress={pickPlayerImage}>
                            {editingPlayerImage ? (
                                <Image source={{ uri: editingPlayerImage }} style={styles.modalPlayerImage} />
                            ) : (
                                <View style={styles.modalPlayerImagePlaceholder}>
                                    <Feather name="camera" size={30} color="#888" />
                                    <Text style={styles.uploadLogoText}>Add Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.inputLabel}>Player Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Player Name"
                            value={editingPlayer?.name || ''}
                            onChangeText={(text) => setEditingPlayer(prev => prev ? { ...prev, name: text } : null)}
                        />
                        <Text style={styles.inputLabel}>Kit Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Kit Number"
                            value={editingPlayer?.kitNumber || ''}
                            onChangeText={(text) => setEditingPlayer(prev => prev ? { ...prev, kitNumber: text } : null)}
                            keyboardType="numeric"
                        />
                        <Text style={styles.inputLabel}>Position</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Position"
                            value={editingPlayer?.position || ''}
                            onChangeText={(text) => setEditingPlayer(prev => prev ? { ...prev, position: text } : null)}
                        />
                        <Text style={styles.inputLabel}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY"
                            value={editingPlayer?.dob || ''}
                            onChangeText={(text) => setEditingPlayer(prev => prev ? { ...prev, dob: text } : null)}
                        />
                        <Text style={styles.inputLabel}>Caps</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Caps"
                            value={editingPlayer?.caps || ''}
                            onChangeText={(text) => setEditingPlayer(prev => prev ? { ...prev, caps: text } : null)}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelEditPlayer}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveButton} onPress={handleEditPlayerSubmit}>
                                <LinearGradient
                                    colors={['#246BFD', '#0C0C69']}
                                    style={styles.gradient}
                                >
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5', // Light grey background for a modern feel
    },
    scrollViewContentContainer: {
        paddingBottom: 40, // More padding at the bottom
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1, // Allow title to take available space
        textAlign: 'center', // Center the title
        marginLeft: -26, // Adjust to visually center due to back button
    },
    headerIcons: {
        flexDirection: 'row',
    },
    headerIcon: {
        marginLeft: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    loadingText: {
        fontSize: 18,
        color: '#555',
    },
    formSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    logoUploadSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    teamLogo: {
        width: 120,
        height: 120,
        borderRadius: 60, // Circular logo
        borderWidth: 3,
        borderColor: '#246BFD', // Blue border for logo
        marginBottom: 15,
        resizeMode: 'cover',
    },
    changeLogoButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#E0E0E0', // Light grey button
    },
    changeLogoButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    inputLabel: {
        fontSize: 15,
        color: '#555',
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 5,
    },
    input: {
        height: 50,
        borderRadius: 10,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    inputMultiline: {
        height: 120,
        borderRadius: 10,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 13,
        marginBottom: 15,
        marginLeft: 5,
        fontWeight: '500',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#a0a0a0',
        marginRight: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#246BFD',
        borderColor: '#246BFD',
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    squadBuilderSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    addPlayerButton: {
        borderRadius: 10,
        marginTop: 15,
        overflow: 'hidden',
        alignSelf: 'stretch',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    gradient: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    playerAddedFeedback: {
        fontSize: 15,
        color: '#28A745',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 15,
        fontWeight: '600',
    },
    playerListContainer: {
        marginTop: 25,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
    },
    sectionTitle: { // Reused for "Current Squad" title
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    playerListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 5,
    },
    playerListHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        textTransform: 'uppercase',
    },
    playerListNumberHeader: {
        width: 30,
        textAlign: 'center',
    },
    playerListPlayerNameHeader: {
        flex: 1,
        marginLeft: 10,
    },
    playerListCapsHeader: {
        width: 50,
        textAlign: 'center',
    },
    playerListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    playerImage: { // Style for player image in list
        width: 40,
        height: 40,
        borderRadius: 20, // Circular
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    playerListNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        width: 30,
        textAlign: 'center',
    },
    playerListItemDetails: {
        flex: 1,
        flexDirection: 'column',
        // marginLeft: 10, // Removed as playerImage handles spacing
    },
    playerListItemName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
    },
    playerListItemPosition: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    playerListItemCaps: {
        fontSize: 16,
        color: '#E91E63',
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
    },
    deletePlayerButton: { // Style for delete icon in player list
        padding: 5,
        marginLeft: 10,
    },
    saveChangesButton: {
        marginHorizontal: 16,
        marginTop: 30,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    officesContainer: {
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingHorizontal: 16,
        backgroundColor: '#fff', // Offices section also in a card
        marginHorizontal: 16,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 20,
    },
    officesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    officesAddress: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black overlay
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: width * 0.9, // 90% of screen width
        maxHeight: '80%', // Limit modal height
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    playerImageUploadContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalPlayerImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#246BFD',
        resizeMode: 'cover',
        marginBottom: 10,
    },
    modalPlayerImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    modalCancelButton: {
        flex: 1,
        marginRight: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#E0E0E0', // Light grey for cancel
        alignItems: 'center',
    },
    modalSaveButton: {
        flex: 1,
        marginLeft: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Added missing style for uploadLogoText
    uploadLogoText: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    },
});

export default EditTeamScreen;
