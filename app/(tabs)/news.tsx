import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import { router } from 'expo-router';

type NewsItem = {
    id: string;
    title: string;
    imageUrl: string;
};

// Dummy news data
const topNews: NewsItem[] = [
    { id: '1', title: 'Namibia Stuns South Africa in Semis', imageUrl: 'https://source.unsplash.com/800x400/?hockey,team' },
    { id: '2', title: 'Historic Win for National U18 Squad', imageUrl: 'https://source.unsplash.com/800x400/?sports,win' },
    { id: '3', title: 'Coach Reveals 2025 Strategy', imageUrl: 'https://source.unsplash.com/800x400/?coach,interview' },
];

const otherNews: NewsItem[] = [
    { id: '4', title: 'Local Clubs Prepare for Regionals', imageUrl: 'https://source.unsplash.com/800x400/?sports,team' },
    { id: '5', title: 'Training Facilities to Get Major Upgrade', imageUrl: 'https://source.unsplash.com/800x400/?gym,hockey' },
    { id: '6', title: 'Winter League Starts Next Month', imageUrl: 'https://source.unsplash.com/800x400/?ice,stadium' },
];

const Page = () => {
    const [query, setQuery] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

    const filteredOtherNews = otherNews.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    const toggleBookmark = (id: string) => {
        setBookmarkedIds(prev =>
            prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
        );
    };

    const isBookmarked = (id: string) => bookmarkedIds.includes(id);

    const renderTopNewsItem = ({ item }: { item: NewsItem }) => {
        const scale = new Animated.Value(1);

        return (
            <Animated.View style={{ transform: [{ scale }], marginRight: 16 }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        router.push({ pathname: '/news/article', params: { title: item.title, imageUrl: item.imageUrl } });
                    }}
                >
                    <Image source={{ uri: item.imageUrl }} style={styles.topNewsImage} />
                    <Text style={styles.topNewsTitle}>{item.title}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderOtherNewsItem = ({ item }: { item: NewsItem }) => {
        const scale = new Animated.Value(1);

        return (
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        router.push({ pathname: '/news/article', params: { title: item.title, imageUrl: item.imageUrl } });
                    }}
                >
                    <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                </TouchableOpacity>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                        <Icon
                            name={isBookmarked(item.id) ? 'bookmark' : 'bookmark-border'}
                            size={24}
                            color={isBookmarked(item.id) ? '#003366' : '#555'}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredOtherNews}
                keyExtractor={item => item.id}
                renderItem={renderOtherNewsItem}
                ListHeaderComponent={
                    <>
                        <SearchBar query={query} onChangeText={setQuery} profilePic={profilePic} />
                        <Text style={styles.sectionTitle}>Top News</Text>
                        <FlatList
                            data={topNews}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderTopNewsItem}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        />
                        <View style={{ height: 24 }} />
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Other News</Text>
                        </View>
                        <View style={{ height: 16 }} />
                    </>
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Bookmark Button */}
            <TouchableOpacity
                style={styles.floatingBookmark}
                onPress={() =>
                    router.push({
                        pathname: '/news/BookmarksScreen',
                        params: { ids: JSON.stringify(bookmarkedIds) },
                    })
                }
            >
                <Icon name="bookmark" size={38} color="#003366" />
            </TouchableOpacity>
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    topNewsImage: {
        width: 260,
        height: 140,
        borderRadius: 10,
        marginBottom: 6,
    },
    topNewsTitle: {
        width: 260,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    card: {
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
        backgroundColor: '#eee',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    cardTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        paddingRight: 8,
    },
    floatingBookmark: {
        position: 'absolute',
        top: 295,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },
});
