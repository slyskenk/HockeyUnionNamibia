import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

const Settings = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRole(docSnap.data().role);
        setSelectedRole(docSnap.data().role);
      } else {
        Alert.alert('Error', 'No such user document!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user) {
      Alert.alert('Update Error', 'No user is signed in.');
      return;
    }

    try {
      await updateEmail(user, newEmail);
      Alert.alert('Success', 'Email updated.');
      setEmail(newEmail);
    } catch (error) {
      Alert.alert('Update Error', error.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) {
      Alert.alert('Password Update Error', 'No user is signed in.');
      return;
    }

    try {
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated.');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Password Update Error', error.message);
    }
  };

  const handleUpdateRole = async () => {
    if (!user) {
      Alert.alert('Update Error', 'No user is signed in.');
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { role: selectedRole });
      Alert.alert('Success', 'Role updated.');
      setRole(selectedRole);
    } catch (error) {
      Alert.alert('Update Error', error.message);
    }
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#ccc',
          alignSelf: 'flex-start',
          borderRadius: 5,
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>← Back</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, marginBottom: 10 }}>Settings</Text>
      <Text>Email: {email}</Text>

      <Text style={{ marginTop: 10 }}>Current Role: {role}</Text>
      <Text>Change Role:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: selectedRole === 'Fan' ? 'blue' : 'lightgray',
            padding: 10,
            marginRight: 10,
          }}
          onPress={() => setSelectedRole('Fan')}
        >
          <Text style={{ color: 'white' }}>Fan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: selectedRole === 'Supporter' ? 'blue' : 'lightgray',
            padding: 10,
          }}
          onPress={() => setSelectedRole('Supporter')}
        >
          <Text style={{ color: 'white' }}>Supporter</Text>
        </TouchableOpacity>
      </View>

      <Button title="Update Role" onPress={handleUpdateRole} />

      <Text style={{ marginTop: 20 }}>New Email</Text>
      <TextInput
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Enter new email"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Update Email" onPress={handleUpdateEmail} />

      <Text style={{ marginTop: 20 }}>New Password</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />

      <View style={{ marginTop: 20 }}>
        <Button title="Sign Out" color="gray" onPress={handleSignOut} />
      </View>
    </View>
  );
};

export default Settings;