import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

const sampleEvent = {
  title: 'Hockey Match',
  team1: 'Team 1 Name',
  team2: 'Team 2 Name',
  date: 'DD/MM/YYYY',
  time: '00:00',
  venue: 'Some Location',
  team1Logo: 'https://via.placeholder.com/50', // Replace with actual logo URL
  team2Logo: 'https://via.placeholder.com/50', // Replace with actual logo URL
};

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EventsScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);

    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : 120, // adjust height as needed
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedOpacity, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.card} onPress={toggleExpand}>
        <Text style={styles.title}>{sampleEvent.title}</Text>

        {/* Team Row with Logos */}
        <View style={styles.row}>
          <View style={styles.teamContainer}>
            <Image source={{ uri: sampleEvent.team1Logo }} style={styles.teamLogo} />
            <View>
              <Text style={styles.label}>TEAM 1</Text>
              <Text style={styles.value}>{sampleEvent.team1}</Text>
            </View>
          </View>
          <View style={styles.teamContainer}>
            <Image source={{ uri: sampleEvent.team2Logo }} style={styles.teamLogo} />
            <View>
              <Text style={styles.label}>TEAM 2</Text>
              <Text style={styles.value}>{sampleEvent.team2}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>DATE</Text>
            <Text style={styles.value}>{sampleEvent.date}</Text>
          </View>
          {expanded && (
            <View>
              <Text style={styles.label}>TIME</Text>
              <Text style={styles.value}>{sampleEvent.time}</Text>
            </View>
          )}
        </View>

        {/* Expandable section */}
        <Animated.View
          style={[
            styles.expandSection,
            {
              height: animatedHeight,
              opacity: animatedOpacity,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.teamContainer}>
              <Image source={{ uri: sampleEvent.team1Logo }} style={styles.teamLogo} />
              <View>
                <Text style={styles.label}>TEAM 1</Text>
                <Text style={styles.value}>{sampleEvent.team1}</Text>
              </View>
            </View>
            <View style={styles.teamContainer}>
              <Image source={{ uri: sampleEvent.team2Logo }} style={styles.teamLogo} />
              <View>
                <Text style={styles.label}>TEAM 2</Text>
                <Text style={styles.value}>{sampleEvent.team2}</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>DATE</Text>
              <Text style={styles.value}>{sampleEvent.date}</Text>
            </View>
            <View>
              <Text style={styles.label}>VENUE</Text>
              <Text style={styles.value}>{sampleEvent.venue}</Text>
            </View>
          </View>

          <CustomButton
            title="Edit Event"
            onPress={() => router.push('/events/createEvents')}
            style={styles.editButton}
          />
        </Animated.View>
      </TouchableOpacity>

      <CustomButton
        title="Create new event"
        onPress={() => router.push('/events/createEvents')}
        style={styles.bottomButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#D6E7FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  expandSection: {
    overflow: 'hidden',
  },
  bottomButton: {
    marginTop: 40,
  },
  editButton: {
    marginTop: 16,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#CBD5E1',
  },
});

export default EventsScreen;
