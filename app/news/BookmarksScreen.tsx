import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, Alert
} from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import MiniSearchBar from '../../components/ui/MiniSearchBar';
import { useRouter } from 'expo-router';

const dummyBookmarks = [
  {
    id: '1',
    title: 'Namibia Defeats South Africa in Semis',
    imageUrl: 'https://source.unsplash.com/800x400/?hockey,team',
    description: 'An incredible upset in the semis where Namibia delivered an astonishing performance to defeat South Africa...',
  },
  {
    id: '2',
    title: 'Coach Reveals 2025 Game Plan',
    imageUrl: 'https://source.unsplash.com/800x400/?coach,interview',
    description: 'The national coach laid out an aggressive strategy for the 2025 season, focusing on youth development and faster transitions...',
  },
];

const BookmarksScreen = () => {
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(dummyBookmarks);
  const router = useRouter();

  const filtered = bookmarks.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleShare = (title: string) => {
    Alert.alert('Share', `Sharing article: ${title}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/news/article',
          params: {
            title: item.title,
            imageUrl: item.imageUrl,
            description: item.description,
          },
        })
      }
      style={styles.card}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
        </View>
        <View style={styles.actions}>
          <MaterialIcons name="bookmark" size={22} color="#004080" />
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Options', '', [
                { text: 'Share', onPress: () => handleShare(item.title) },
                { text: 'Delete', onPress: () => handleDelete(item.id), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
          >
            <Entypo name="dots-three-vertical" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmarks</Text>
      <MiniSearchBar query={query} onChangeText={setQuery} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2ff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  desc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 12,
  },
});
