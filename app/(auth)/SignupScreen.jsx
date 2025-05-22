import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SocialButtons from '../../components/SocialButton';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        Alert.alert('Already signed in', `Welcome back ${user.email}`);
        Alert.alert('Signed In', 'Welcome! ❤️');
      }
    });
    return unsubscribe;
  }, []);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    

    setLoading(true);



    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoading(false);
      Alert.alert('Success', `Account created for ${user.email}`);
      router.push('/news');




    } catch (error) {
      setLoading(false);
      let message = 'Signup failed. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email.';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters.';
          break;
        default:
          message = error.message;
      }
      Alert.alert('Signup Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Create Account</Text>

      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <TextInput placeholder="Confirm password" secureTextEntry style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'SIGN UP'}</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or sign up with</Text>
      <SocialButtons />

      <TouchableOpacity onPress={() => router.push('LoginScreen')}>
        <Text style={styles.linkText}>Have an account? <Text style={styles.link}>SIGN IN</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

// Your existing styles remain unchanged

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 80, height: 80, marginTop: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  input: {
    width: '100%', height: 50, backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 16, marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  checkboxText: { marginLeft: 8 },
  button: { backgroundColor: '#005D8F', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginVertical: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  orText: { marginVertical: 8 },
  linkText: { marginTop: 20 },
  link: { fontWeight: 'bold', color: '#005D8F' },
});
