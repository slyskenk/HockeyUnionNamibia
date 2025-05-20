import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LiveFeed from './screens/LiveFeed';
import LiveDetail from './screens/LiveDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LiveFeed">
        <Stack.Screen name="LiveFeed" component={LiveFeed} options={{ title: 'Live Feed' }} />
        <Stack.Screen name="LiveDetail" component={LiveDetail} options={{ title: 'Live Update' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
