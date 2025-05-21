import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define the type for the navigation parameters.
// This is crucial for TypeScript to understand what parameters can be passed to 'TeamsScreen'.
type RootStackParamList = {
    TeamsScreen: { newTeam: Team } | undefined; // newTeam is optional as it's not always passed
    // Add other screen names and their params if necessary, e.g.,
    // RegisterTeamScreen: undefined;
};

// Extend the useNavigation hook with our custom RootStackParamList
type RegisterTeamScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TeamsScreen'>;


interface Team {
    id?: string; // Make ID optional for new teams before they are assigned one
    name: string;
    contactPerson: string;
    contactPersonCellNumber: string;
    contactPersonEmail: string;
    nominatedUmpireName: string;
    nominatedUmpireCellphoneNumber: string;
    logo?: string; // Optional
    premierDivision: boolean;
    termsAndConditions: boolean; // New field for T&Cs
    idea?: string; // New field for "Let's talk about your idea"
}

const RegisterTeamScreen = () => {
    const navigation = useNavigation<RegisterTeamScreenNavigationProp>(); // Use typed navigation
    const [teamData, setTeamData] = useState<Team>({
        name: '',
        contactPerson: '',
        contactPersonCellNumber: '',
        contactPersonEmail: '',
        nominatedUmpireName: '',
        nominatedUmpireCellphoneNumber: '',
        logo: '',
        premierDivision: false,
        termsAndConditions: false,
        idea: '',
    });
    const [image, setImage] = useState<string | null>(null); // State for the selected image
    const [emailError, setEmailError] = useState<string | null>(null);


    // Updated handleInputChange to correctly handle boolean values for checkboxes
    const handleInputChange = useCallback((field: keyof Team, value: string | boolean) => {
        setTeamData(prevData => ({
            ...prevData,
            [field]: value,
        }));

        // Email validation
        if (field === 'contactPersonEmail') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof value === 'string' && value && !emailRegex.test(value)) {
                setEmailError('Please, enter a valid email address');
            } else {
                setEmailError(null);
            }
        }
    }, []);

    const handleRegisterTeam = useCallback(() => {
        // Perform final validation before submission
        if (emailError) {
            Alert.alert('Validation Error', 'Please fix the email error before submitting.');
            return;
        }
        if (!teamData.termsAndConditions) {
            Alert.alert('Validation Error', 'Please accept the Terms and Conditions to register.');
            return;
        }
        if (!teamData.name || !teamData.contactPerson || !teamData.contactPersonCellNumber || !teamData.contactPersonEmail || !teamData.nominatedUmpireName || !teamData.nominatedUmpireCellphoneNumber) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return;
        }

        // Generate a unique ID for the new team
        const newTeamId = `team-${Date.now()}`;
        const newTeam: Team = { // Ensure newTeam explicitly conforms to Team interface
            id: newTeamId,
            name: teamData.name,
            contactPerson: teamData.contactPerson,
            contactPersonCellNumber: teamData.contactPersonCellNumber,
            contactPersonEmail: teamData.contactPersonEmail,
            nominatedUmpireName: teamData.nominatedUmpireName,
            nominatedUmpireCellphoneNumber: teamData.nominatedUmpireCellphoneNumber,
            logo: teamData.logo || require('../../assets/images/genericClubAvatar.jpg'), // Use a placeholder if no logo is uploaded
            premierDivision: teamData.premierDivision,
            termsAndConditions: teamData.termsAndConditions,
            idea: teamData.idea,
        };

        // Navigate back to the TeamsScreen and pass the new team data
        navigation.navigate('TeamsScreen', { newTeam: newTeam });
        Alert.alert('Success', 'Team registered successfully!');

    }, [navigation, teamData, emailError]);

    const pickImage = useCallback(async () => {
        // Request permissions to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload a logo.');
            return;
        }

        // Launch the image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3], // You can adjust the aspect ratio as needed
            quality: 1, // Adjust image quality (0 to 1)
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Set the selected image URI
            handleInputChange('logo', result.assets[0].uri); // Also store it in teamData for submission
        }
    }, [handleInputChange]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Register New Team</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Club Name"
                    value={teamData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Club Contact Person"
                    value={teamData.contactPerson}
                    onChangeText={(text) => handleInputChange('contactPerson', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Person Cell Number"
                    value={teamData.contactPersonCellNumber}
                    onChangeText={(text) => handleInputChange('contactPersonCellNumber', text)}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Person Email"
                    value={teamData.contactPersonEmail}
                    onChangeText={(text) => handleInputChange('contactPersonEmail', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Nominated Umpire Name"
                    value={teamData.nominatedUmpireName}
                    onChangeText={(text) => handleInputChange('nominatedUmpireName', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nominated Umpire Cellphone Number"
                    value={teamData.nominatedUmpireCellphoneNumber}
                    onChangeText={(text) => handleInputChange('nominatedUmpireCellphoneNumber', text)}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.inputMultiline}
                    placeholder="Let's talk about your idea"
                    value={teamData.idea}
                    onChangeText={(text) => handleInputChange('idea', text)}
                    multiline={true}
                    numberOfLines={4}
                />

                {/* Upload Club Logo Section */}
                <TouchableOpacity style={styles.uploadLogoContainer} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.logoPreview} />
                    ) : (
                        <View style={styles.logoPlaceholder}>
                            <Feather name="upload" size={30} color="#888" />
                            <Text style={styles.uploadLogoText}>Upload Club Logo</Text>
                        </View>
                    )}
                    <Text style={styles.fileSizeText}>Attach file, File size of your documents should not exceed 10MB</Text>
                </TouchableOpacity>


                {/* Premier Division Checkbox */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleInputChange('premierDivision', !teamData.premierDivision)}
                >
                    <View style={[
                        styles.checkbox,
                        teamData.premierDivision && styles.checkboxChecked,
                    ]} />
                    <Text style={styles.checkboxLabel}>Premier Division</Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleRegisterTeam}>
                    <LinearGradient
                        colors={['#246BFD', '#0C0C69']} // Blue gradient from previous request
                        style={styles.gradient}
                    >
                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Terms and Conditions Checkbox */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleInputChange('termsAndConditions', !teamData.termsAndConditions)}
                >
                    <View style={[
                        styles.checkbox,
                        teamData.termsAndConditions && styles.checkboxChecked,
                    ]} />
                    <Text style={styles.checkboxLabel}>Tc's and C's</Text>
                </TouchableOpacity>

                {/* Offices Information */}
                <View style={styles.officesContainer}>
                    <Text style={styles.officesTitle}>Offices</Text>
                    <Text style={styles.officesAddress}>Cricket Street, Windhoek, Namibia 9000.</Text>
                    <Text style={styles.officesAddress}>They also have a PO Box address: PO Box 25799, Post Street Mall Windhoek, Namibia 9000</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContentContainer: {
        paddingBottom: 20, // Ensure there's padding at the bottom for scrollability
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
    formContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
    },
    inputMultiline: {
        height: 100, // Increased height for multiline input
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
        textAlignVertical: 'top', // Ensure text starts from the top
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    },
    uploadLogoContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        borderStyle: 'dashed',
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    uploadLogoText: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    },
    fileSizeText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
    logoPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        backgroundColor: '#f8f8f8',
    },
    checkboxChecked: {
        backgroundColor: '#246BFD', // Blue checkmark color
        borderColor: '#246BFD',
    },
    checkboxLabel: {
        fontSize: 16,
        color: 'black',
    },
    submitButton: {
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 16, // Space before T&C checkbox
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    gradient: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    officesContainer: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    officesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
    },
    officesAddress: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default RegisterTeamScreen;
