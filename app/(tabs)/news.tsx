// screens/Page.tsx (or wherever this lives)
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import newsData from '../news/news'; // ✅ adjust path
import SearchBar from '../../components/SearchBar'; // ✅ import your new component

type NewsItem = {
    id: string;
    title: string;
    imageUrl: any;
};

const Page = () => {
    const [query, setQuery] = useState('');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [profilePic, setProfilePic] = useState<string | null>(null);

    useEffect(() => {
        setNews(newsData);
        fetchProfilePic();
    }, []);

    const fetchProfilePic = async () => {
        const auth = getAuth();
        const firestore = getFirestore();
        const user = auth.currentUser;

        if (user) {
            const docRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.profilePicture) {
                    setProfilePic(data.profilePicture);
                }
            }
        }
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    const renderItem = ({ item }: { item: NewsItem }) => (
        <View style={styles.card}>
            <Image source={item.imageUrl} style={styles.cardImage} />
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
            <FlatList
                data={filteredNews}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={
                    <>
                        <SearchBar
                            query={query}
                            onChangeText={setQuery}
                            profilePic={profilePic}
                        />
                        <View style={{ height: 16 }} />
                    </>
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
    },
});
