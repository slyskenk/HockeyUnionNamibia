import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
    const navigation = useNavigation();

    // Dummy data for the user profile.  Replace with your actual data source and state management.
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 498 788 9999',
        password: 'password123', // In a real app, handle password securely!
        avatar: 'https://via.placeholder.com/150', // Replace with a real image URL
    });

    const handleInputChange = (field: keyof typeof profileData, value: string) => {
        setProfileData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleUpdateProfile = () => {
        // Implement your profile update logic here.
        console.log('Updated Profile Data:', profileData);
        // After successful update, you might want to navigate back.
        navigation.goBack();
    };

    const handleChangePicture = () => {
        // Handle image selection logic here
        console.log('Change Picture')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {/* Use an icon here if you have one, or a simple Text */}
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                {/* Leave this empty, or add a settings icon if needed */}
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.profileContainer}>
                <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.changePictureButton} onPress={handleChangePicture}>
                    <Text style={styles.changePictureButtonText}>Change Picture</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Id</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.phone}
                        onChangeText={(text) => handleInputChange('phone', text)}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                    <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
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
        marginTop: 20, // Add space for status bar on iOS
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    backButtonText: {
        fontSize: 24,
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
    changePictureButton: {
        marginBottom: 30,
    },
    changePictureButtonText: {
        color: '#007BFF', //  blue
        fontSize: 16,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#888',
        marginBottom: 4,
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 18,
        color: 'black',
    },
    updateButton: {
        backgroundColor: '#007BFF', //  blue
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 30,
        width: '100%',
        alignItems: 'center'
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;
