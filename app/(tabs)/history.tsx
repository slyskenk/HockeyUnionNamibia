import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const achievements = [
    {
        year: 1990,
        event: "Post-Independence Debut on the International Stage: First appearances in regional African tournaments.",
        image: 'https://placehold.co/600x400/007AFF/FFFFFF?text=Namibia+Team+1990s',
    },
    {
        year: 1993,
        event: "First African Cup of Nations Participation: Gaining international exposure and experience.",
        image: 'https://placehold.co/600x400/336699/FFFFFF?text=African+Cup+93',
    },
    {
        year: 2005,
        event: "Women's Team Shines at Africa Cup of Nations: Consistently strong performances in continental championships.",
        image: 'https://placehold.co/600x400/FFCC00/000000?text=Women+Team+2005',
    },
    {
        year: 2009,
        event: "Hosting the Indoor Hockey World Cup Qualifiers (African): Successful hosting of a major continental qualifier.",
        image: 'https://placehold.co/600x400/FF9900/FFFFFF?text=Indoor+Qualifiers+09',
    },
    {
        year: 2011,
        event: "Men's Indoor Team Qualifies for World Cup: First-ever Indoor Hockey World Cup qualification (Men).",
        image: 'https://placehold.co/600x400/66CC66/000000?text=Men+Indoor+WC+11',
    },
    {
        year: 2015,
        event: "Women's Indoor Team Qualifies for World Cup: First-ever Indoor Hockey World Cup qualification (Women).",
        image: 'https://placehold.co/600x400/FF6666/FFFFFF?text=Women+Indoor+WC+15',
    },
    {
        year: 2018,
        event: "Double Qualification for Indoor Hockey World Cup: Simultaneous qualification for both men's and women's Indoor World Cups.",
        image: 'https://placehold.co/600x400/9966CC/FFFFFF?text=Double+Quali+18',
    },
    {
        year: 2021,
        event: "African Indoor Hockey Cup Success: Strong performances in African Indoor Hockey Cup.",
        image: 'https://placehold.co/600x400/00BFFF/FFFFFF?text=African+Indoor+21',
    },
    {
        year: 2023,
        event: "Another Indoor Hockey World Cup Appearance: Continued presence at the Indoor Hockey World Cup.",
        image: 'https://placehold.co/600x400/FFD700/000000?text=Indoor+WC+23',
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
