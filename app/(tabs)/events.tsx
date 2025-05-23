import React, { useEffect, useRef, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Event {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

const EventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'events'), orderBy('timestamp', 'desc')), snapshot => {
      const data: Event[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const isExpanded = expandedId === id;
    setExpandedId(isExpanded ? null : id);

    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 0 : 120,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedOpacity, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#3B82F6" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {events.map(event => {
        const isExpanded = expandedId === event.id;

        return (
          <TouchableOpacity key={event.id} style={styles.card} onPress={() => toggleExpand(event.id)}>
            <Text style={styles.title}>Hockey Match</Text>

            {/* Team Row */}
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>TEAM 1</Text>
                <Text style={styles.value}>{event.team1}</Text>
              </View>
              <View>
                <Text style={styles.label}>TEAM 2</Text>
                <Text style={styles.value}>{event.team2}</Text>
              </View>
            </View>

            {/* Date and Time */}
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>DATE</Text>
                <Text style={styles.value}>{event.date}</Text>
              </View>
              {isExpanded && (
                <View>
                  <Text style={styles.label}>TIME</Text>
                  <Text style={styles.value}>{event.time}</Text>
                </View>
              )}
            </View>

            {/* Expandable Section */}
            {isExpanded && (
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
                  <View>
                    <Text style={styles.label}>VENUE</Text>
                    <Text style={styles.value}>{event.venue}</Text>
                  </View>
                </View>
                <CustomButton
                  title="Edit Event"
                  onPress={() => router.push(`/events/createEvents?id=${event.id}`)}
                  style={styles.editButton}
                />
              </Animated.View>
            )}
          </TouchableOpacity>
        );
      })}

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
    paddingBottom: 100,
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
    marginTop: 10,
  },
  editButton: {
    marginTop: 16,
  },
  bottomButton: {
    marginTop: 40,
  },
});

export default EventsScreen;
