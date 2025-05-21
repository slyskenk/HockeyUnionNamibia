import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Import the custom SearchBar component
// IMPORTANT: Adjusted path for common expo-router project structures.
// If your 'components' folder is directly inside 'app', use '../components/SearchBar'.
// If 'teams.tsx' is directly in 'app' and 'components' is at root, use '../components/SearchBar'.
// If 'teams.tsx' is in 'app/(tabs)/teams.tsx' and 'components' is at root, use '../../components/SearchBar'.
import SearchBar from '../../components/teamsSearchBar'; // Assuming app/(tabs)/teams.tsx -> components/SearchBar.tsx

// Define Player interface (consistent with RegisterTeamScreen)
interface Player {
    id: string;
    name: string;
    kitNumber: string;
    position: string;
    dob: string;
    caps: string;
}

// Define Team interface, now consistent with RegisterTeamScreen for incoming data
interface Team {
  id: string; // ID is mandatory for existing teams
  name: string;
  coach: string; // This will be contactPerson from RegisterTeamScreen for newly added teams
  logo: ImageSourcePropType;
  players?: Player[]; // Make players optional here if not all teams will have it, or mandatory if always expected

  // Add properties from RegisterTeamScreen's Team interface for incoming newTeam data
  contactPerson?: string;
  contactPersonCellNumber?: string;
  contactPersonEmail?: string;
  nominatedUmpireName?: string;
  nominatedUmpireCellphoneNumber?: string;
  premierDivision?: boolean;
  termsAndConditions?: boolean;
  idea?: string;
}

// Define the type for the navigation parameters.
type RootStackParamList = {
    TeamsScreen: { newTeam?: Team } | undefined; // newTeam is optional as it's not always passed
    RegisterTeamScreen: undefined; // Add other screen names and their params if necessary
    EditTeamScreen: { teamId: string }; // Add other screen names and their params if necessary
};

type TeamsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TeamsScreen'>;


// Dummy data for local teams with local image imports
const initialLocalTeamsData: Team[] = [
  {
    id: 'saints-hockey',
    name: 'Saints Hockey',
    coach: 'Johan Weyhe',
    logo: require('../../assets/images/find_a_club/Saints-Big.png'),
    players: [], // Initialize with empty array or relevant player data
  },
  {
    id: 'school-of-excellence',
    name: 'The School of Excellence Hockey Club',
    coach: 'Melissa Gillies',
    logo: require('../../assets/images/find_a_club/School-of-Excellencer.png'),
    players: [],
  },
  {
    id: 'red-triangle-club',
    name: 'DTS',
    coach: 'Coach C',
    logo: require('../../assets/images/find_a_club/DTS-01r.png'),
    players: [],
  },
  {
    id: 'namibia-masters-hockey',
    name: 'Namibia Masters Hockey',
    coach: 'Coach D',
    logo: require('../../assets/images/find_a_club/NAMIBIA-MASTERS-HOCKEY-LOGO-01r-1536x1086.png'),
    players: [],
  },
  {
    id: 'wanderers-windhoek',
    name: 'Wanderers Windhoek',
    coach: 'Coach E',
    logo: require('../../assets/images/find_a_club/wanderers.png'),
    players: [],
  },
  {
    id: 'hockey-leaves-club',
    name: 'Team X',
    coach: 'Coach F',
    logo: require('../../assets/images/find_a_club/Team-X.jpg'),
    players: [],
  },
  {
    id: 'coastal-raiders-hockey-club',
    name: 'Coastal Raiders Hockey Club',
    coach: 'Coach G',
    logo: require('../../assets/images/find_a_club/Coastal-Raidersr.png'),
    players: [],
  },
  {
    id: 'sparta-hockey-club',
    name: 'Sparta Hockey Club',
    coach: 'Coach H',
    logo: require('../../assets/images/find_a_club/Sparta-1024x1448.jpg'),
    players: [],
  },
  {
    id: 'windhoek-old-boys',
    name: 'Windhoek Old Boys',
    coach: 'Coach I',
    logo: require('../../assets/images/find_a_club/Old-Boys.jpg'),
    players: [],
  },
];

const TeamsScreen = () => {
  const navigation = useNavigation<TeamsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial teams data
  useEffect(() => {
    setTeams(initialLocalTeamsData);
    setLoading(false);
  }, []);

  // Use useFocusEffect to listen for navigation events when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const currentRoute = navigation.getState().routes.find(
        (route) => route.name === 'TeamsScreen'
      );

      // Safely access params and newTeam with correct type assertion
      const params = currentRoute?.params as RootStackParamList['TeamsScreen'];
      const newTeam = params?.newTeam;

      if (newTeam && !teams.some((team) => team.id === newTeam.id)) {
        // Map the newTeam data to the structure expected by TeamsScreen's Team interface
        // Specifically, map contactPerson to coach, and ensure logo is ImageSourcePropType
        const teamToAdd: Team = {
            id: newTeam.id || `team-${Date.now()}`, // Ensure ID exists
            name: newTeam.name,
            coach: newTeam.contactPerson || 'N/A', // Map contactPerson to coach, provide fallback
            logo: typeof newTeam.logo === 'string' ? { uri: newTeam.logo } : newTeam.logo, // Handle logo type
            players: newTeam.players, // Include players
            // Copy other relevant properties if needed for display or future use
            contactPerson: newTeam.contactPerson,
            contactPersonCellNumber: newTeam.contactPersonCellNumber,
            contactPersonEmail: newTeam.contactPersonEmail,
            nominatedUmpireName: newTeam.nominatedUmpireName,
            nominatedUmpireCellphoneNumber: newTeam.nominatedUmpireCellphoneNumber,
            premierDivision: newTeam.premierDivision,
            termsAndConditions: newTeam.termsAndConditions,
            idea: newTeam.idea,
        };
        setTeams((prevTeams) => [...prevTeams, teamToAdd]);

        // IMPORTANT: In a real app, after consuming the param, you should clear it
        // from the navigation state to prevent re-adding the team on subsequent focuses.
        // This is tricky with expo-router's router.push directly.
        // A more robust solution involves a global state management library or
        // a custom navigation action to clear params.
      }
    }, [navigation, teams]) // Depend on navigation and teams to react to changes
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredTeams = initialLocalTeamsData.filter((team) =>
      team.name.toLowerCase().includes(query.toLowerCase())
    );
    setTeams(filteredTeams);
  };

  const goToRegisterClub = () => {
    router.push('/teams/registerTeam');
  };

  const goToEditClub = (teamId: string) => {
    router.push({ pathname: '/teams/editTeam', params: { teamId } });
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local Teams</Text>
      </View>

      {/* Search Bar Section - Using the custom SearchBar component */}
      <SearchBar
        query={searchQuery}
        onChangeText={handleSearch}
        profilePic={null}
      />

      {/* All Teams Section */}
      <Text style={styles.sectionTitle}>All Clubs</Text>
      {teams.map((team) => (
        <TouchableOpacity
          key={team.id}
          style={styles.teamCard}
          onPress={() => goToEditClub(team.id)}
        >
          <View style={styles.teamInfo}>
            <Image source={team.logo} style={styles.teamLogo} />
            <View>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.coach}>Current Coach: {team.coach}</Text>
              {team.players && team.players.length > 0 && (
                <Text style={styles.playerCountText}>Players: {team.players.length}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Action Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={goToRegisterClub}
        >
          <LinearGradient colors={['#246BFD', '#0C0C69']} style={styles.gradient}>
            <Text style={styles.buttonText}>Register a club</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/teams/editTeam')}
        >
          <LinearGradient colors={['#246BFD', '#0C0C69']} style={styles.gradient}>
            <Text style={styles.buttonText}>Edit a club</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollViewContentContainer: {
    paddingBottom: 100,
  },
  header: { padding: 16, marginTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'black' },
  searchInput: {
    flex: 1,
    height: '100%',
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
  teamName: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  coach: { fontSize: 14, color: '#666' },
  playerCountText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  teamInfo: { flexDirection: 'row', alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { color: 'red', fontSize: 18, marginBottom: 10, textAlign: 'center' },
  retryText: { color: 'blue', fontSize: 16, textDecorationLine: 'underline' },
});

export default TeamsScreen;
