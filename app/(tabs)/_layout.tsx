import { View, Text } from 'react-native';
import React from 'react'
import { Tabs } from 'expo-router'
import {TabBar} from "@/components/TabBar";

const TabLayout = () => {
    return(
        <Tabs
            initialRouteName='events'
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name='news' options={{title: 'News'}} />
            <Tabs.Screen name='teams' options={{title: 'Teams'}} />
            <Tabs.Screen name='events' options={{title: 'Events'}} />
            <Tabs.Screen name='history' options={{title: 'History'}} />
            <Tabs.Screen name='profile' options={{title: 'Profile'}} />
        </Tabs>

    )
}

export default TabLayout;
