import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  updateProfile,
  reload,
} from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton'; // ✅ Import custom button

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  const storage = getStorage();

  const [profileData, setProfileData] = useState({
    name: user?.displayName || 'John Doe',
    email: user?.email || '',
    phone: '+1 498 788 9999',
    password: '',
    avatar: user?.photoURL || 'https://via.placeholder.com/150',
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera roll permission is required.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      try {
        const image = pickerResult.assets[0];
        const response = await fetch(image.uri);
        const blob = await response.blob();

        const fileRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(fileRef, blob);
        const downloadURL = await getDownloadURL(fileRef);

        setProfileData((prev) => ({ ...prev, avatar: downloadURL }));
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload failed', 'Could not upload image.');
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!user) return;

      // Update Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        avatar: profileData.avatar,
      });

      // Update Auth Profile
      await updateProfile(user, {
        displayName: profileData.name,
        photoURL: profileData.avatar,
      });

      await reload(user);

      setProfileData((prev) => ({ ...prev, avatar: user.photoURL }));

      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const confirmSave = () => {
    Alert.alert(
      'Save Changes?',
      'Do you want to save the changes you made to your profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: handleUpdateProfile },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
        <TouchableOpacity onPress={handleChangePicture}>
          <Text style={styles.changePicture}>Change Profile Picture</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profileData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={profileData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
          />
        </View>

        <CustomButton title="Save Changes" onPress={confirmSave} />
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#ddd',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  changePicture: {
    fontSize: 15,
    color: '#007BFF',
    marginBottom: 30,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
