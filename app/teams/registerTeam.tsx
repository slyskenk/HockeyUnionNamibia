import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase'; // 🔥 Update path as needed

type RootStackParamList = {
  TeamsScreen: undefined;
};

type RegisterTeamScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TeamsScreen'>;

interface Team {
  name: string;
  contactPerson: string;
  contactPersonCellNumber: string;
  contactPersonEmail: string;
  nominatedUmpireName: string;
  nominatedUmpireCellphoneNumber: string;
  logo?: string;
  premierDivision: boolean;
  termsAndConditions: boolean;
  idea?: string;
}

const RegisterTeamScreen = () => {
  const navigation = useNavigation<RegisterTeamScreenNavigationProp>();
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

  const [image, setImage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((field: keyof Team, value: string | boolean) => {
    setTeamData(prev => ({ ...prev, [field]: value }));

    if (field === 'contactPersonEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && value && !emailRegex.test(value)) {
        setEmailError('Please, enter a valid email address');
      } else {
        setEmailError(null);
      }
    }
  }, []);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload a logo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      handleInputChange('logo', uri);
    }
  }, [handleInputChange]);

  const handleRegisterTeam = useCallback(async () => {
    if (emailError) {
      Alert.alert('Validation Error', 'Please fix the email error before submitting.');
      return;
    }
    if (!teamData.termsAndConditions) {
      Alert.alert('Validation Error', 'Please accept the Terms and Conditions.');
      return;
    }

    const requiredFields = ['name', 'contactPerson', 'contactPersonCellNumber', 'contactPersonEmail', 'nominatedUmpireName', 'nominatedUmpireCellphoneNumber'];
    const missingFields = requiredFields.filter(field => !teamData[field as keyof Team]);

    if (missingFields.length > 0) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      let logoUrl = '';

      // If user uploaded a logo
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `team_logos/${Date.now()}-${Math.random()}.jpg`);
        await uploadBytes(storageRef, blob);
        logoUrl = await getDownloadURL(storageRef);
      }

      const newTeam = {
        ...teamData,
        logo: logoUrl || '', // Empty string if no logo
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'teams'), newTeam);

      Alert.alert('Success', 'Team registered successfully!');
      navigation.navigate('TeamsScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  }, [teamData, image, emailError, navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Register New Team</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Club Name" value={teamData.name} onChangeText={text => handleInputChange('name', text)} />
        <TextInput style={styles.input} placeholder="Club Contact Person" value={teamData.contactPerson} onChangeText={text => handleInputChange('contactPerson', text)} />
        <TextInput style={styles.input} placeholder="Contact Person Cell Number" value={teamData.contactPersonCellNumber} onChangeText={text => handleInputChange('contactPersonCellNumber', text)} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Contact Person Email" value={teamData.contactPersonEmail} onChangeText={text => handleInputChange('contactPersonEmail', text)} keyboardType="email-address" autoCapitalize="none" />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        <TextInput style={styles.input} placeholder="Nominated Umpire Name" value={teamData.nominatedUmpireName} onChangeText={text => handleInputChange('nominatedUmpireName', text)} />
        <TextInput style={styles.input} placeholder="Nominated Umpire Cellphone Number" value={teamData.nominatedUmpireCellphoneNumber} onChangeText={text => handleInputChange('nominatedUmpireCellphoneNumber', text)} keyboardType="phone-pad" />
        <TextInput style={styles.inputMultiline} placeholder="Let's talk about your idea" value={teamData.idea} onChangeText={text => handleInputChange('idea', text)} multiline numberOfLines={4} />

        {/* Upload Logo */}
        <TouchableOpacity style={styles.uploadLogoContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.logoPreview} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Feather name="upload" size={30} color="#888" />
              <Text style={styles.uploadLogoText}>Upload Club Logo</Text>
            </View>
          )}
          <Text style={styles.fileSizeText}>Attach file (Max 10MB)</Text>
        </TouchableOpacity>

        {/* Premier Division */}
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => handleInputChange('premierDivision', !teamData.premierDivision)}>
          <View style={[styles.checkbox, teamData.premierDivision && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>Premier Division</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleRegisterTeam} disabled={loading}>
          <LinearGradient colors={['#246BFD', '#0C0C69']} style={styles.gradient}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>SUBMIT</Text>}
          </LinearGradient>
        </TouchableOpacity>

        {/* T&Cs */}
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => handleInputChange('termsAndConditions', !teamData.termsAndConditions)}>
          <View style={[styles.checkbox, teamData.termsAndConditions && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>Tc's and C's</Text>
        </TouchableOpacity>

        {/* Office Info */}
        <View style={styles.officesContainer}>
          <Text style={styles.officesTitle}>Offices</Text>
          <Text style={styles.officesAddress}>Cricket Street, Windhoek, Namibia 9000.</Text>
          <Text style={styles.officesAddress}>PO Box 25799, Post Street Mall Windhoek, Namibia 9000</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollViewContentContainer: { paddingBottom: 20 },
  header: { padding: 16, alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'black' },
  formContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  input: {
    height: 48, borderRadius: 8, borderColor: '#ddd', borderWidth: 1,
    marginBottom: 16, paddingHorizontal: 12, fontSize: 16, backgroundColor: '#f8f8f8',
  },
  inputMultiline: {
    height: 100, textAlignVertical: 'top', borderRadius: 8, borderColor: '#ddd', borderWidth: 1,
    marginBottom: 16, paddingHorizontal: 12, fontSize: 16, backgroundColor: '#f8f8f8',
  },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 5 },
  uploadLogoContainer: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, borderStyle: 'dashed',
    padding: 20, alignItems: 'center', marginBottom: 20,
  },
  logoPlaceholder: { alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  uploadLogoText: { fontSize: 16, color: '#888', marginTop: 5 },
  fileSizeText: { fontSize: 12, color: '#888', textAlign: 'center' },
  logoPreview: { width: 100, height: 100, borderRadius: 8, marginBottom: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1,
    borderColor: '#ddd', marginRight: 10, backgroundColor: '#f8f8f8',
  },
  checkboxChecked: { backgroundColor: '#246BFD', borderColor: '#246BFD' },
  checkboxLabel: { fontSize: 16, color: 'black' },
  submitButton: {
    borderRadius: 12, marginTop: 20, marginBottom: 16,
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3,
  },
  gradient: { padding: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  officesContainer: { marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  officesTitle: { fontSize: 18, fontWeight: 'bold', color: 'black', marginBottom: 5 },
  officesAddress: { fontSize: 14, color: '#666', lineHeight: 20 },
});

export default RegisterTeamScreen;
