import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';



const liveUpdates = [
  {
    id: '1',
    title: 'Linkin Park to play Champions League final pre-match live show',
    time: '1M',
    image: 'https://example.com/image1.jpg',
  },
  {
    id: '2',
    title: 'Champions League live match updates: Real Madrid–Lille',
    time: '8M',
    image: 'https://example.com/image2.jpg',
  },
  {
    id: '3',
    title: 'Champions League live match updates: Arsenal–PSG',
    time: '8M',
    image: 'https://example.com/image3.jpg',
  },
  {
    id: '4',
    title: 'Manika Batra leads India\'s campaign at TT Worlds...',
    time: '4h',
    image: 'https://example.com/image4.jpg',
  },
  {
    id: '5',
    title: 'Ayhika-Sutirtha exit in second round...',
    time: '1d',
    image: 'https://example.com/image5.jpg',
  },
];

const LiveFeed = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.time}>{item.time} ago</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Sharing Updates</Text>
      <FlatList
        data={liveUpdates}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default LiveFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  image: {
    width: 90,
    height: 60,
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});
