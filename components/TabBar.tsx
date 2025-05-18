import React, { JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from '@expo/vector-icons';

type TabName = 'news' | 'teams' | 'events' | 'history' | 'profile';

const icon: Record<TabName, (props: { color: string }) => JSX.Element> = {
    news: (props) => <Feather name="book-open" size={20} {...props} />,
    teams: (props) => <Feather name="users" size={20} {...props} />,
    events: (props) => <Feather name="home" size={20} {...props} />,
    history: (props) => <Feather name="archive" size={20} {...props} />,
    profile: (props) => <Feather name="user" size={20} {...props} />
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const tabName = route.name as TabName;
                const isFocused = state.index === index;
                const label: string = String(options.tabBarLabel ?? options.title ?? route.name);
                const TabIcon = icon[tabName] ?? (() => <Feather name="help-circle" size={20} color={"#222"} />);

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabBarItem}
                    >
                        <TabIcon color={isFocused ? '#0000FF' : '#222'} />
                        <Text style={[styles.label, { color: isFocused ? '#0000FF' : '#222' }]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#ccc'
    },
    tabBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold'
    }
});
