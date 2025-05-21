import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";
import { NavigationContainer } from '@react-navigation/native';
export default function Layout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? '#FFD580' : '#A77C1F',
          tabBarInactiveTintColor: isDark ? '#F7EFE5' : '#888',
          tabBarStyle: {
            backgroundColor: isDark ? '#22223B' : '#F7EFE5',
            borderTopWidth: 0,
            height: 70,
          },
          headerStyle: {
            backgroundColor: isDark ? '#22223B' : '#F7EFE5',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: isDark ? '#F7EFE5' : '#22223B',
            fontWeight: '700',
            fontSize: 20,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sunny-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="JournalScreen"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="GoalsScreen"
          options={{
            title: 'Goals',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkmark-done-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="MoodTrackerScreen"
          options={{
            title: 'Mood',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="happy-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="SettingsScreen"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}