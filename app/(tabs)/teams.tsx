import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchBar from '../../components/teamsSearchBar';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { firebaseApp } from '../../firebase/firebase'; // Ensure correct path

// Firebase setup
const db = getFirestore(firebaseApp);

// Interfaces
interface Player {
  id: string;
  name: string;
  kitNumber: string;
  position: string;
  dob: string;
  caps: string;
}

interface Team {
  id: string;
  name: string;
  coach: string;
  logo: string | { uri: string };
  players?: Player[];
  contactPerson?: string;
  contactPersonCellNumber?: string;
  contactPersonEmail?: string;
  nominatedUmpireName?: string;
  nominatedUmpireCellphoneNumber?: string;
  premierDivision?: boolean;
  termsAndConditions?: boolean;
  idea?: string;
}

type RootStackParamList = {
  TeamsScreen: { newTeam?: Team } | undefined;
  RegisterTeamScreen: undefined;
  EditTeamScreen: { teamId: string };
};

type TeamsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TeamsScreen'
>;

const TeamsScreen = () => {
  const navigation = useNavigation<TeamsScreenNavigationProp>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time fetch teams from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'teams'),
      (snapshot) => {
        const fetchedTeams: Team[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Club',
            coach: data.contactPerson || 'Unknown',
            logo:
              typeof data.logo === 'string'
                ? { uri: data.logo }
                : require('../../assets/images/genericClubAvatar.jpg'), // fallback logo
            players: data.players || [],
            contactPerson: data.contactPerson,
            contactPersonCellNumber: data.contactPersonCellNumber,
            contactPersonEmail: data.contactPersonEmail,
            nominatedUmpireName: data.nominatedUmpireName,
            nominatedUmpireCellphoneNumber: data.nominatedUmpireCellphoneNumber,
            premierDivision: data.premierDivision,
            termsAndConditions: data.termsAndConditions,
            idea: data.idea,
          };
        });

        setTeams(fetchedTeams);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Clean up listener
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const goToRegisterClub = () => {
    router.push('/teams/registerTeam');
  };

  const goToEditClub = (teamId: string) => {
    router.push({ pathname: '/teams/editTeam', params: { teamId } });
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading teams...</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local Teams</Text>
      </View>

      <SearchBar
        query={searchQuery}
        onChangeText={handleSearch}
        profilePic={null}
      />

      <Text style={styles.sectionTitle}>All Clubs</Text>
      {filteredTeams.map((team) => (
        <TouchableOpacity
          key={team.id}
          style={styles.teamCard}
          onPress={() => goToEditClub(team.id)}
        >
          <View style={styles.teamInfo}>
            <Image
              source={
                typeof team.logo === 'string'
                  ? { uri: team.logo }
                  : team.logo
              }
              style={styles.teamLogo}
            />
            <View>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.coach}>Coach: {team.coach}</Text>
              {team.players && team.players.length > 0 && (
                <Text style={styles.playerCountText}>
                  Players: {team.players.length}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={goToRegisterClub}>
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
