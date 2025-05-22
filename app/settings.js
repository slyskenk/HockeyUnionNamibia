import { useNavigation } from '@react-navigation/native';
import { Button, ButtonGroup, Input, Text } from '@rneui/themed';
import { getAuth, signOut, updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Image, View } from 'react-native';
import { db } from '../firebase/firebase';

export default function Settings() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [roleIndex, setRoleIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || null);

  const roles = ['Fan', 'Supporter'];

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setAvatarUrl(user.photoURL);
      loadUserData();
    }
  }, []);

  async function loadUserData() {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setRole(userData.role);
        const index = roles.indexOf(userData.role);
        if (index !== -1) setRoleIndex(index);
      }
    } catch (error) {
      Alert.alert('Error fetching user data', error.message);
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
    try {
      setLoading(true);
      await updateEmail(user, newEmail);
      setEmail(newEmail);
      Alert.alert('Success', 'Email updated!');
    } catch (error) {
      Alert.alert('Email Update Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword() {
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

  async function uploadAvatar() {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (result.didCancel || !result.assets?.length) return;

      const imageUri = result.assets[0].uri;
      const userId = user.uid;

      const reference = storage().ref(`avatars/${userId}`);
      await reference.putFile(imageUri);

      const downloadURL = await reference.getDownloadURL();
      await user.updateProfile({ photoURL: downloadURL });
      setAvatarUrl(downloadURL);

      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      Alert.alert('Upload Error', error.message);
    }
  }

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed out successfully!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        Alert.alert('Sign Out Error', error.message);
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={styles.heading}>Settings</Text>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
          />
        ) : (
          <Text>No profile picture</Text>
        )}
        <Button title="Change Profile Picture" onPress={uploadAvatar} />
      </View>

      <Text style={styles.label}>Email: {email}</Text>
      <Text style={styles.label}>Current Role: {role}</Text>

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
});