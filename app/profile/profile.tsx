import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db as firestore } from '../../firebase/firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
  });

  const [scaleEdit] = useState(new Animated.Value(1));
  const [scaleLogout] = useState(new Animated.Value(1));

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData({
              name: data.name || user.displayName || 'John Doe',
              email: data.email || user.email || 'john.doe@example.com',
              phone: data.phone || '+1 498 788 9999',
              avatar: data.avatar || null,
            });
          } else {
            console.log('No user document found!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          auth.signOut();
          router.replace('/');
        },
      },
    ]);
  };

  const animateButton = (button: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(button, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(button, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity
          onPress={() => router.push('/profile/settingScreen')}
          style={{ padding: 4 }}
        >
          <Ionicons name="settings-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture + Edit Button */}
      <View style={styles.profileContainer}>
        {profileData?.avatar ? (
          <Image
            source={{ uri: profileData.avatar }}
            style={styles.avatar}
            onError={() =>
              setProfileData((prev) => ({ ...prev, avatar: null }))
            }
          />
        ) : (
          <Image
            source={require('../../assets/images/avatar.jpg')}
            style={styles.avatar}
          />
        )}

        <Animated.View style={{ transform: [{ scale: scaleEdit }] }}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => animateButton(scaleEdit, () => router.push('/profile/editProfile'))}
          >
            <Ionicons name="pencil" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.info}>{profileData.name}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.info}>{profileData.email}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.info}>{profileData.phone}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.quote}>“Coffee. Code. Sleep. Repeat.”</Text>

        <Animated.View style={{ transform: [{ scale: scaleLogout }] }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => animateButton(scaleLogout, handleLogout)}
          >
            <MaterialIcons name="logout" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: '#f2f4f8',
    flexGrow: 1,
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
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  footer: {
    marginTop: 30,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
