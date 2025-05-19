import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

// Dummy data for local teams - Replace with your actual data source
const localTeamsData = [
  {
    id: 'indoor-men-saints',
    name: 'Indoor Men Saints',
    coach: 'Johan Weyhe',
    logo: 'https://via.placeholder.com/50',
  },
  {
    id: 'indoor-men-wanderers',
    name: 'Indoor Men Wanderers',
    coach: 'Melissa Gillies',
    logo: 'https://via.placeholder.com/50',
  },
  {
    id: 'indoor-women-saints',
    name: 'Indoor Women Saints',
    coach: 'Johan Weyhe',
    logo: 'https://via.placeholder.com/50',
  },
  {
    id: 'indoor-women-wanderers',
    name: 'Indoor Women Wanderers',
    coach: 'Melissa Gillies',
    logo: 'https://via.placeholder.com/50',
  },
];

const LocalTeamsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState(localTeamsData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredTeams = localTeamsData.filter((team) =>
      team.name.toLowerCase().includes(query.toLowerCase())
    );
    setTeams(filteredTeams);
  };

  const goToEditClub = (teamId: string) => {
    router.push({ pathname: '/teams/editTeam', params: { teamId } });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local Teams</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <MaterialCommunityIcons
          name="microphone-outline"
          size={24}
          color="#888"
        />
      </View>

      {/* Indoor Men Premier */}
      <Text style={styles.sectionTitle}>Indoor Men Premier</Text>
      {teams
        .filter((team) => team.name.toLowerCase().includes('indoor men'))
        .map((team) => (
          <TouchableOpacity
            key={team.id}
            style={styles.teamCard}
            onPress={() => goToEditClub(team.id)}
          >
            <View style={styles.teamInfo}>
              <Image source={{ uri: team.logo }} style={styles.teamLogo} />
              <View>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.coach}>
                  Current Coach: {team.coach}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

      {/* Indoor Women Premier */}
      <Text style={styles.sectionTitle}>Indoor Women Premier</Text>
      {teams
        .filter((team) => team.name.toLowerCase().includes('indoor women'))
        .map((team) => (
          <TouchableOpacity
            key={team.id}
            style={styles.teamCard}
            onPress={() => goToEditClub(team.id)}
          >
            <View style={styles.teamInfo}>
              <Image source={{ uri: team.logo }} style={styles.teamLogo} />
              <View>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.coach}>
                  Current Coach: {team.coach}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/teams/registerTeam')}
        >
          <LinearGradient
            colors={['#4a148c', '#1a237e']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Register a club</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/teams/editTeam')}
        >
          <LinearGradient
            colors={['#007BFF', '#0040FF']}
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
    alignItems: 'center',
  },
});

export default LocalTeamsScreen;
