import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, Alert
} from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import MiniSearchBar from '../../components/ui/MiniSearchBar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import allNews from '../../assets/data/news.json'; // Import full JSON

type NewsItem = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  timestamp: number;
};

const BookmarksScreen = () => {
  const router = useRouter();
  const { ids } = useLocalSearchParams();
  const bookmarkedIds = JSON.parse(ids as string) as string[];

  // Filter articles that match bookmarkedIds
  const bookmarkedArticles: NewsItem[] = (allNews as NewsItem[]).filter(article =>
    bookmarkedIds.includes(article.id)
  );

  const handleRemove = (id: string) => {
    Alert.alert('Remove Bookmark', 'Are you sure you want to remove this article?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => Alert.alert('Functionality to remove not implemented') }
    ]);
  };

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/news/article',
          params: {
            title: item.title,
            content: item.content,
            imageUrl: item.imageUrl,
          },
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleRemove(item.id)}>
          <Entypo name="dots-three-vertical" size={18} color="#333" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MiniSearchBar placeholder="Search bookmarks..." />
      <FlatList
        data={bookmarkedArticles}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FA',
    paddingTop: 10,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    paddingRight: 8,
    color: '#333',
  },
});
