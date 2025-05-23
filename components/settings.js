import { useNavigation } from '@react-navigation/native';
import { Button, ButtonGroup, Input, Text } from '@rneui/themed';
import { auth, db, storage } from '../firebase/firebase';
import { signOut, updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [roleIndex, setRoleIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const roles = ['Fan', 'Supporter'];

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      loadUserData();
    } else {
      Alert.alert("Error", "No authenticated user found");
    }
  }, []);

  async function loadUserData() {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setRole(userData.role);
        setImageUrl(userData.photoURL);
        const index = roles.indexOf(userData.role);
        if (index !== -1) setRoleIndex(index);
      } else {
        Alert.alert('Error', 'User data not found in Firestore');
      }
    } catch (error) {
      Alert.alert('Error loading user data', error.message);
    }
  }

  async function updateUserRole() {
    try {
      setLoading(true);
      const selectedRole = roles[roleIndex];
      await updateDoc(doc(db, 'users', user.uid), { role: selectedRole });
      setRole(selectedRole);
      Alert.alert('Success', `Role updated to ${selectedRole}`);
    } catch (error) {
      Alert.alert('Update Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateEmail() {
    if (!newEmail) {
      Alert.alert("Error", "Please enter a new email");
      return;
    }

    try {
      setLoading(true);
      await updateEmail(user, newEmail);
      await updateDoc(doc(db, 'users', user.uid), { email: newEmail });
      setEmail(newEmail);
      Alert.alert('Success', 'Email updated!');
    } catch (error) {
      Alert.alert('Email Update Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword() {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated!');
    } catch (error) {
      Alert.alert('Password Update Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleImagePick() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
      Alert.alert('Success', 'Profile picture updated!');
    }
  }

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed out successfully!');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      })
      .catch((error) => {
        Alert.alert('Sign Out Error', error.message);
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text h4 style={styles.heading}>Settings</Text>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={handleImagePick}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
          ) : (
            <Text>Tap to upload profile picture</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Email: {email || 'Not found'}</Text>
      <Text style={styles.label}>Current Role: {role || 'Unknown'}</Text>

      <Text style={[styles.label, { marginTop: 20 }]}>Change Role:</Text>
      <ButtonGroup
        buttons={roles}
        selectedIndex={roleIndex}
        onPress={setRoleIndex}
        containerStyle={{ marginBottom: 20 }}
      />
      <Button title="Update Role" disabled={loading} onPress={updateUserRole} />

      <Input
        label="New Email"
        placeholder="Enter new email"
        value={newEmail}
        onChangeText={setNewEmail}
        autoCapitalize="none"
      />
      <Button title="Update Email" disabled={loading || !newEmail} onPress={handleUpdateEmail} />

      <Input
        label="New Password"
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Button title="Update Password" disabled={loading || !newPassword} onPress={handleUpdatePassword} />

      <Button title="Sign Out" onPress={handleSignOut} buttonStyle={{ marginTop: 20 }} type="outline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40,
    alignItems: 'stretch',
  },
  heading: {
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});