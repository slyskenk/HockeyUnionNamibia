import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'react-native';

interface Team {
    name: string;
    shortName: string;
    province: string;
    district: string;
    logo?: string; // Optional
}

const RegisterTeamScreen = () => {
    const navigation = useNavigation();
    const [teamData, setTeamData] = useState<Team>({
        name: '',
        shortName: '',
        province: '',
        district: '',
        logo: '',
    });
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');


    // Dummy data for provinces and districts.  Replace with your actual data.
    const provinces = ['Erongo', 'Hardap', 'Karas', 'Khomas', 'Kunene', 'Kavango East', 'Kavango West', 'Omaheke', 'Omusati', 'Oshana', 'Oshikoto', 'Otjozondjupa', 'Zambezi'];
    const districts: { [province: string]: string[] } = {
        'Erongo': ['Arandis', 'Swakopmund', 'Walvis Bay'],
        'Hardap': ['Gibeon', 'Mariental'],
        'Karas': ['Keetmanshoop', 'Lüderitz'],
        'Khomas': ['Windhoek'],
        'Kunene': ['Opuwo', 'Khorixas'],
        'Kavango East': ['Rundu'],
        'Kavango West': ['Nkurenkuru'],
        'Omaheke': ['Gobabis'],
        'Omusati': ['Outapi'],
        'Oshana': ['Oshakati'],
        'Oshikoto': ['Tsumeb'],
        'Otjozondjupa': ['Otjiwarongo', 'Okahandja'],
        'Zambezi': ['Katima Mulilo']
    };

    const handleInputChange = (field: keyof Team, value: string) => {
        setTeamData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setSelectedDistrict(''); // Reset district when province changes
        setTeamData(prevData => ({
            ...prevData,
            province: value,
            district: '', // Clear the district
        }));
    };

    const handleDistrictChange = (value: string) => {
        setSelectedDistrict(value);
        setTeamData(prevData => ({
            ...prevData,
            district: value,
        }));
    };


    const handleRegisterTeam = () => {
        // Implement your team registration logic here
        console.log('Team Data:', teamData);
        // After successful registration, you might want to navigate back
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Register New Team</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Team Name"
                    value={teamData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Team Short Name"
                    value={teamData.shortName}
                    onChangeText={(text) => handleInputChange('shortName', text)}
                />
                <Picker
                    selectedValue={selectedProvince}
                    onValueChange={handleProvinceChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Province" value="" />
                    {provinces.map((province) => (
                        <Picker.Item key={province} label={province} value={province} />
                    ))}
                </Picker>

                <Picker
                    selectedValue={selectedDistrict}
                    onValueChange={handleDistrictChange}
                    style={styles.picker}
                    enabled={!!selectedProvince} // Disable if no province is selected
                >
                    <Picker.Item label="Select District" value="" />
                    {selectedProvince &&
                        districts[selectedProvince].map((district) => (
                            <Picker.Item key={district} label={district} value={district} />
                        ))}
                </Picker>

                <TextInput
                    style={styles.input}
                    placeholder="Logo URL" //  Consider a file picker library
                    value={teamData.logo}
                    onChangeText={(text) => handleInputChange('logo', text)}
                />
                {teamData.logo ? (
                    <Image source={{ uri: teamData.logo }} style={styles.logoPreview} />
                ) : null}

                <TouchableOpacity style={styles.registerButton} onPress={handleRegisterTeam}>
                    <LinearGradient
                        colors={['#4CAF50', '#388E3C']} // Green gradient
                        style={styles.gradient}
                    >
                        <Text style={styles.registerButtonText}>Register Team</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
    picker: {
        height: 48,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
    },
    registerButton: {
        borderRadius: 12,
        marginTop: 20,
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
    registerButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    logoPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 10,
    },
});

export default RegisterTeamScreen;
