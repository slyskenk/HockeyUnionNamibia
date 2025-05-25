import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const achievements = [
    {
        year: 1990,
        event: "Women's Field Hockey: 2nd at Africa Cup of Nations (Harare)",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'),
    },
    {
        year: 1995,
        event: "First African Games appearances for both Men's (5th) and Women's (4th) Field Hockey",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'),
    },
    {
        year: 2003,
        event: "Men's Field Hockey: Bronze at African Games",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'),
    },
    {
        year: 2018,
        event: "Women's Team: Qualified for Hockey World League Semifinals",
        image: require('../../assets/images/events/20241218-Hockey-Nkosi-Cup-Final-1-Namibia-Celebrate-Win-1024x640.jpg'),
    },
];

const HistoryScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Our History and Achievements 🏆</Text>
                <Text style={styles.headerSubtitle}>A timeline of proud moments in Namibian hockey</Text>
            </View>

            <View style={styles.timeline}>
                {achievements.map((achievement, index) => (
                    <TouchableOpacity key={index} style={styles.card} activeOpacity={0.8} onPress={() => {}}>
                        <View style={styles.leftColumn}>
                            <View style={styles.dot} />
                            {index !== achievements.length - 1 && <View style={styles.verticalLine} />}
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.year}>{achievement.year}</Text>
                            <Text style={styles.event}>{achievement.event}</Text>
                            <Image source={achievement.image} style={styles.image} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F3FA',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#D0EAFB',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#02457A',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'left',
        marginTop: 6,
    },
    timeline: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    leftColumn: {
        width: 20,
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#0077B6',
        marginTop: 5,
    },
    verticalLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#0077B6',
        marginTop: 2,
    },
    content: {
        flex: 1,
        marginLeft: 10,
    },
    year: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0077B6',
        marginBottom: 4,
    },
    event: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
        lineHeight: 22,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        resizeMode: 'cover',
    },
});

export default HistoryScreen;
