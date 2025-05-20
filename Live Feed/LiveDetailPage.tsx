import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const LiveDetail = ({ route }) => {
  const { title, content, updatedAt } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>Last Updated: {updatedAt}</Text>

      <TouchableOpacity style={styles.likeSection}>
        <FontAwesome name="heart-o" size={20} color="#444" />
        <Text style={styles.likeText}> Like</Text>
      </TouchableOpacity>

      <Text style={styles.content}>{content}</Text>

      <View style={styles.tabBar}>
        <Text style={[styles.tab, styles.activeTab]}>LIVE</Text>
        <Text style={styles.tab}>INFO</Text>
      </View>

      <View style={styles.liveUpdateBox}>
        <Text style={styles.timestamp}>01/10/2024 08:40 PM</Text>
        <Text style={styles.updateTitle}>Scores from across Europe this evening</Text>

        <Text style={styles.updateLine}><Text style={styles.bold}>Full-time:</Text> Stuttgart 1–1 Sparta Prague</Text>
        <Text style={styles.updateLine}><Text style={styles.bold}>Full-time:</Text> Salzburg 0–4 Brest</Text>
        <Text style={styles.updateLine}><Text style={styles.bold}>Full-time:</Text> Arsenal 2–0 Paris Saint-Germain</Text>
        <Text style={styles.updateLine}><Text style={styles.bold}>Full-time:</Text> Barcelona 5–0 Young Boys</Text>
      </View>
    </ScrollView>
  );
};

export default LiveDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  likeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  likeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 8,
    color: '#aaa',
  },
  activeTab: {
    color: '#d00',
    borderBottomWidth: 2,
    borderBottomColor: '#d00',
  },
  liveUpdateBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  updateLine: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});
