import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

// Define your news item type
type NewsItem = {
    id: string;
    title: string;
};

// Static news data — add more items as needed
const NEWS: NewsItem[] = [
    {
        id: '1',
        title: 'A Namibian Hockey Legend has departed',
    },
    {
        id: '2',
        title: 'Watch out world, Namibia and South Africa are on their way',
    },
];

// Map each id to its image require() path
const imageMap: Record<string, any> = {
    '1': require('../../assets/images/news/MarcNel.jpg'),
    '2': require('../../assets/images/news/namibia_women.png'),
};

const Page = () => {
    const [query, setQuery] = useState('');

    // Filter news by search query
    const filteredNews = NEWS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    const renderItem = ({ item }: { item: NewsItem }) => (
        <View style={styles.card}>
            <Image source={imageMap[item.id]} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <TouchableOpacity>
                    <Icon name="bookmark-border" size={24} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Search bar */}
            <View style={styles.searchBar}>
                <Icon name="search" size={24} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={query}
                    onChangeText={setQuery}
                />
                <TouchableOpacity>
                    <Icon name="mic" size={24} />
                </TouchableOpacity>
            </View>

            {/* News list */}
            <FlatList
                data={filteredNews}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 8,
        ...Platform.select({
            ios: { height: 36 },
            android: { height: 44 },
        }),
    },
    list: { paddingHorizontal: 16, paddingBottom: 24 },
    card: {
        marginBottom: 24,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
    },
    cardImage: { width: '100%', height: 180 },
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
    },
});

// Reminder: after adding new images, restart Metro with:
//   expo start --clear
