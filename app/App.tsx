// In your App.tsx or another relevant file
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsScreen from '../app/(tabs)/events'; // Adjust the path if needed
import CreateEventScreen from './(tabs)/events/createEvents'; // Import the new screen
// ... other imports

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Events" component={EventsScreen} />
                <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                {/* Add other screens here */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
