import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventsScreen from './(tabs)/events';
import CreateEventScreen from '../app/events/createEvents';
import LoginScreen from './(auth)/LoginScreen';
import SignupScreen from './(auth)/SignupScreen';
import SplashScreen from './(auth)/SplashScreen';
import NewsScreen from './(tabs)/news';
import ProfileScreen from './profile/profile';
import TeamsScreen from './(tabs)/teams'; // Fix casing if needed
import RegisterTeamScreen from './teams/registerTeam';
import EditTeamScreen from './teams/editTeam';
import EditProfileScreen from './profile/editProfile';
import SettingsScreen from './profile/settingScreen';
import LiveDetail from './(tabs)/LiveDetailPage';
import BookmarksScreen from './news/BookmarksScreen';




const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



// Tab Navigator (Main app)
function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Teams" component={TeamsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="LiveDetail" component={LiveDetail} />

    </Tab.Navigator>
  );
}

// Main App Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name ="registerTeam" component={RegisterTeamScreen}/>
        <Stack.Screen name ="editTeam" component={EditTeamScreen}/>
        <Stack.Screen name ="editProfile" component={EditProfileScreen}/>
        <Stack.Screen name="Settings" component={SettingsScreen} />
         <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="LiveDetail" component={LiveDetail}  />
          <Stack.Screen name="BookMarks" component={BookmarksScreen}  />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
