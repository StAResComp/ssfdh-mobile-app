import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

return (
	<Tabs
		screenOptions={{
		tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
		headerShown: false,
	}}>
		<Tabs.Screen
			name="index"
			options={{
			title: 'Home',
			tabBarIcon: ({ color, focused }) => (
				<TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
		),}}
		/>
		<Tabs.Screen
			name="catch"
			options={{
			title: 'Catch',
			tabBarIcon: ({ color, focused }) => (
				<TabBarIcon name={focused ? 'fish' : 'fish-outline'} color={color} />
			),}}
		/>
		<Tabs.Screen
			name="alterCatch"
			options={{
				title: 'Catch Verivication',
				tabBarIcon: ({ color, focused }) => (
					<TabBarIcon name={focused ? 'reorder-four' : 'reorder-four-outline'} color={color} />
				),
			}}
		/>
		<Tabs.Screen
			name="gear"
			options={{
			title: 'gear',
			tabBarIcon: ({ color, focused }) => (
				<TabBarIcon name={focused ? 'image' : 'image-outline'} color={color} />
				),
			}} />
		<Tabs.Screen
			name="settings"
			options={{
				title: 'settings',
				tabBarIcon: ({ color, focused }) => (
					<TabBarIcon name={focused ? 'image' : 'image-outline'} color={color} />
				),
			}} />
	</Tabs>
	);
}
