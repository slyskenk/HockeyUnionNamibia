import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

// Dummy data for achievements.  Replace with your actual data source.
const achievements = [
    {
        year: 1990,
        event: "Women's Field Hockey: 2nd at Africa Cup of Nations (Harare)",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'), // Replace with actual image path
    },
    {
        year: 1995,
        event: "First African Games appearances for both Men's (5th) and Women's (4th) Field Hockey",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'), // Replace with actual image path
    },
    {
        year: 1990,
        event: "Women's Field Hockey: 2nd at Africa Cup of Nations (Harare)",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'),  // Replace with actual image path
    },
    {
        year: 1995,
        event: "First African Games appearances for both Men's (5th) and Women's (4th) Field Hockey",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'), // Replace with actual image path
    },
];

const HistoryScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>History</Text>
                <Text style={styles.headerSubtitle}>Backlog of all our achievements...</Text>
            </View>

            <View style={styles.achievementsContainer}>
                {achievements.map((achievement, index) => (
                    <View key={index} style={styles.achievementItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.textContainer}>
                            <Text style={styles.year}>{achievement.year}</Text>
                            <Text style={styles.event}>{achievement.event}</Text>
                        </View>
                        <Image source={achievement.image} style={styles.image} />
                    </View>
                ))}
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
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
    achievementsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
        marginRight: 10,
        marginTop: 5, // Adjust as needed for vertical alignment with text
    },
    textContainer: {
        flex: 1,
    },
    year: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    event: {
        fontSize: 16,
        color: 'black',
    },
    image: {
        width: 100,  // Adjust size as needed
        height: 80, // Adjust size as needed
        borderRadius: 8,
        marginLeft: 10,
        resizeMode: 'cover', // Or 'contain', depending on your needs
    },
});

export default HistoryScreen;
