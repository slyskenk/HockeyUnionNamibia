import { useRouter } from 'expo-router'; // ✅ import router
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';



export default function SplashScreen({ navigation }) {
// timer to take user to login page
const router = useRouter(); // ✅ initialize router
useEffect(() => {
    const timer = setTimeout(() => {
      router.push('LoginScreen') // ✅ navigate to Login screen using router
    }, 2000);

    return () => clearTimeout(timer); // cleanup
  }, [router]);


//old code
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')} // Replace with your logo
        style={styles.logo}
        resizeMode="contain"
      />
{/* 🔵 This is the spinner */}
    <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
