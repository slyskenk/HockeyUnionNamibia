import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, ButtonGroup, Input, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, signOut, updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // your firebase config file

export default function Settings() {
  const navigation = useNavigation();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const roles = ['Fan', 'Supporter'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        setEmail(authUser.email);

        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setRole(data.role);
            const index = roles.indexOf(data.role);
            if (index !== -1) setRoleIndex(index);
          }
        } catch (error) {
          Alert.alert('Error loading user data', error.message);
        } finally {
          setLoading(false);
        }
      } else {
        Alert.alert('Authentication Error', 'No user signed in.');
        navigation.replace('Login'); // redirect to login
      }
    });

    return unsubscribe;
  }, []);

  const updateUserRole = async () => {
    if (!user) return;

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
  };

  const handleUpdateEmail = async () => {
    if (!newEmail) {
      Alert.alert('Input Error', 'Please enter a new email.');
      return;
    }

    try {
      setLoading(true);
      await updateEmail(user, newEmail);
      await updateDoc(doc(db, 'users', user.uid), { email: newEmail });
      setEmail(newEmail);
      setNewEmail('');
      Alert.alert('Success', 'Email updated successfully.');
    } catch (error) {
      Alert.alert('Email Update Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      Alert.alert('Input Error', 'Please enter a new password.');
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      setNewPassword('');
      Alert.alert('Success', 'Password updated successfully.');
    } catch (error) {
      Alert.alert('Password Update Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      })
      .catch((error) => {
        Alert.alert('Sign Out Error', error.message);
      });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={styles.heading}>Settings</Text>

      <Button title="Back" onPress={handleGoBack} type="outline" />

      <Text style={styles.label}>Email: {email || 'Not available'}</Text>
      <Text style={styles.label}>Current Role: {role || 'Not set'}</Text>

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
      <Button title="Update Email" onPress={handleUpdateEmail} disabled={loading} />

      <Input
        label="New Password"
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Button title="Update Password" onPress={handleUpdatePassword} disabled={loading} />

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

