import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Article {
    title: string;
    author: string;
    date: string;
    content: string;
    imageUrl: string;
}

const ArticleScreen = () => {
    const navigation = useNavigation();

    // Dummy data for the article.  Replace with your actual data source.
    const articleData: Article = {
        title: 'Watch out world, Namibia and South Africa are on their way',
        author: 'John Doe',
        date: 'October 26, 2023', // Example date
        content: `South Africa men and Namibia women have secured their places at the FIH Indoor Hockey World Cup in Belgium next year after an intense three days of hockey competition in Durban, South Africa.

It was a tournament packed with high scoring matches, a great competitive atmosphere and a sense of relief to be back playing international hockey. As Tournament Director Sarah Bennett said: "The Indoor Africa Cup was a great success. It was amazing to see international hockey being played on African soil during these very trying times, due to the Covid 19 pandemic.

"The quality of hockey was of a high standard and it was fantastic to see the growth in Botswana hockey since their last international series in 2019.

"It was also a credit to the South African Hockey Association for hosting such a great event under the circumstances and we look forward to seeing both South Africa and Namibia compete at the World Cup next year.`,
        imageUrl: 'https://via.placeholder.com/600x400', // Replace with a real image URL
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="bookmark-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="share-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <Image source={{ uri: articleData.imageUrl }} style={styles.articleImage} />
            <View style={styles.contentContainer}>
                <Text style={styles.articleTitle}>{articleData.title}</Text>
                <Text style={styles.articleAuthor}>By {articleData.author} - {articleData.date}</Text>

                <Text style={styles.articleContent}>
                    {articleData.content}
                </Text>
                {/* You can add more styled Text components here for different paragraphs */}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginTop: 20, // Add space for status bar on iOS
    },
    articleImage: {
        width: '100%',
        height: 250, // Or any fixed height you prefer
        resizeMode: 'cover', // Or 'contain', depending on how you want it to display
    },
    contentContainer: {
        padding: 16,
    },
    articleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    articleAuthor: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    articleContent: {
        fontSize: 16,
        lineHeight: 24, // Adjust line height for readability
        color: '#333',
    },
});

export default ArticleScreen;
