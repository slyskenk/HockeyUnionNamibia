import { Tabs } from 'expo-router';
import { Image, View, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';

export default function Layout() {
  const state = useNavigationState(state => state);
  const currentRoute = state?.routes[state.index]?.name;
  const shouldHideTabBar = currentRoute === 'forum';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: shouldHideTabBar
          ? { display: 'none' }
          : {
              height: 70,
              borderTopWidth: 1,
              borderColor: '#ccc',
              backgroundColor: '#fff',
            },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        header: () => (
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        ),
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'news':
              return <Ionicons name="home" size={size} color={color} />;
            case 'search':
              return <Ionicons name="search" size={size} color={color} />;
            case 'events':
              return <MaterialCommunityIcons name="calendar" size={size} color={color} />;
            case 'forum':
              return <FontAwesome5 name="comments" size={size} color={color} />;
            case 'history':
              return <MaterialCommunityIcons name="history" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="news" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'TeamsScreen' }} />
      <Tabs.Screen name="events" options={{ title: 'Events' }} />
      <Tabs.Screen name="forum" options={{ title: 'Forum' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: Platform.OS === 'android' ? 90 : 100,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  logo: {
    height: 50,
    width: 1600,
  },
});
