import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router'; // Assuming expo-router is used for navigation
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType // Import ImageSourcePropType
  ,







  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Define the Team type
interface Team {
  id: string;
  name: string;
  coach: string;
  logo: ImageSourcePropType; // Change logo type to ImageSourcePropType
}

// Dummy data for local teams with local image imports
// IMPORTANT: Replace these paths with your actual local image paths.
// For example: require('../../assets/images/saints.png')
const localTeamsData: Team[] = [
  {
    id: 'indoor-men-saints',
    name: 'Saints',
    coach: 'Johan Weyhe',
    logo: require('../../assets/images/find_a_club/wanderers.png'), // Placeholder for Saints logo
  },
  {
    id: 'indoor-men-wanderers',
    name: 'Wanderers',
    coach: 'Melissa Gillies',
    logo: require('../../assets/images/find_a_club/wanderers.png'), // Placeholder for Wanderers logo
  },
  {
    id: 'indoor-women-saints',
    name: 'Saints Womens Team',
    coach: 'Johan Weyhe',
    logo: require('../../assets/images/find_a_club/wanderers.png'), // Placeholder for Saints logo
  },
  {
    id: 'indoor-women-wanderers',
    name: 'Wanderers Womens National Team',
    coach: 'Melissa Gillies',
    logo: require('../../assets/images/find_a_club/wanderers.png'), // Placeholder for Wanderers logo
  },
];

const TeamsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data, in a real app this would be an API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate network delay
        setTimeout(() => {
          setTeams(localTeamsData);
          setLoading(false);
        }, 500);
      } catch (err: any) {
        setError(err.message || 'Failed to load teams data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Filter teams based on the search query
    const filteredTeams = localTeamsData.filter((team) =>
      team.name.toLowerCase().includes(query.toLowerCase())
    );
    setTeams(filteredTeams);
  };

  const goToRegisterClub = () => {
    // Navigate to the RegisterTeamScreen (assuming the route is '/teams/registerTeam')
    router.push('/teams/registerTeam');
  };

  const goToEditClub = (teamId: string) => {
    // Navigate to the EditTeamScreen and pass the teamId as a parameter
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
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local Teams</Text>
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <MaterialCommunityIcons name="microphone-outline" size={24} color="#888" />
      </View>

      {/* Indoor Men Premier Section */}
      <Text style={styles.sectionTitle}>Indoor Men Premier</Text>
      {teams
        .filter((team) => team.name.toLowerCase().includes('saints') || team.name.toLowerCase().includes('wanderers')) // Filter for men's teams
        .map((team) => (
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
              </View>
            </View>
          </TouchableOpacity>
        ))}

      {/* Indoor Women Premier Section */}
      <Text style={styles.sectionTitle}>Indoor Women Premier</Text>
      {teams
        .filter((team) => team.name.toLowerCase().includes('womens')) // Filter for women's teams
        .map((team) => (
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
          <LinearGradient colors={['#4a148c', '#1a237e']} style={styles.gradient}>
            <Text style={styles.buttonText}>Register a club</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/teams/editTeam')} // Assuming a generic edit route
        >
          <LinearGradient colors={['#007BFF', '#0040FF']} style={styles.gradient}>
            <Text style={styles.buttonText}>Edit a club</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, marginTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'black' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 20,
    height: 48, // Fixed height for consistency
  },
  searchInput: {
    flex: 1,
    height: '100%', // Take full height of container
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
    borderRadius: 25, // Makes the logo circular
    marginRight: 16,
  },
  teamName: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  coach: { fontSize: 14, color: '#666' },
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
    overflow: 'hidden', // Ensures gradient respects border radius
  },
  editButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    overflow: 'hidden', // Ensures gradient respects border radius
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
