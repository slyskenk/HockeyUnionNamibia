import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
    const navigation = useNavigation();

    // Dummy data for the user profile. Replace the avatar URL with a require statement.
    const profileData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 498 788 9999',
        avatar: require('../../assets/images/avatar.jpg'), //  local image
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.backButtonText, { fontSize: 30 }]}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>
            

            <View style={styles.profileContainer}>
                <Image source={profileData.avatar} style={styles.avatar} />
                <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <View style={styles.userInfoContainer}>
                    <Text style={styles.label}>Username</Text>
                    <Text style={styles.info}>{profileData.name}</Text>
                </View>

                <View style={styles.userInfoContainer}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.info}>{profileData.email}</Text>
                </View>

                <View style={styles.userInfoContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <Text style={styles.info}>{profileData.phone}</Text>
                </View>
            </View>
        </View>
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
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    backButtonText: {
        fontSize: 24, // Increased font size
        color: 'black',
    },
    profileContainer: {
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    editProfileButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 30,
    },
    editProfileButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userInfoContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#888',
        marginBottom: 4,
    },
    info: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
