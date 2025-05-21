import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    Alert,
    ScrollView,
    useColorScheme,
    StatusBar,
    Platform,
    Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { getTheme, ThemeColorScheme } from '@theme/theme';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Language = 'en' | 'de' | 'fr' | 'es';

// Storage keys
const STORAGE_KEYS = {
    THEME: '@motivo_theme_color',
    LANGUAGE: '@motivo_language',
    REMINDER_ENABLED: '@motivo_reminder_enabled',
    REMINDER_TIME: '@motivo_reminder_time',
};

// Theme options
const THEME_COLORS: { key: ThemeColorScheme; label: string; color: string }[] = [
    { key: 'light', label: 'Light', color: '#F8F6F2' },
    { key: 'ocean', label: 'Ocean', color: '#4EA2DD' },
    { key: 'forest', label: 'Forest', color: '#7AC064' },
    { key: 'minimal', label: 'Minimal', color: '#B3B3B3' },
];

// Language options
const LANGUAGES: { key: Language; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'de', label: 'Deutsch' },
    { key: 'fr', label: 'Français' },
    { key: 'es', label: 'Español' },
];

// Support options
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const SUPPORT_OPTIONS: {
    id: string;
    title: string;
    icon: IoniconName;
    onPress: () => void;
}[] = [
        {
            id: 'rate',
            title: 'Rate App',
            icon: 'star-outline',
            onPress: () => Alert.alert('Coming Soon', 'This feature will be available in the next update.')
        },
        {
            id: 'privacy',
            title: 'Privacy Policy',
            icon: 'shield-outline',
            onPress: () => Alert.alert('Privacy Policy', 'We respect your privacy and do not collect any personal information.')
        },
        {
            id: 'contact',
            title: 'Contact Support',
            icon: 'mail-outline',
            onPress: () => Alert.alert('Contact', 'Email us at support@motivo.app')
        },
    ];

const SettingsScreen = () => {
    const [themeColor, setThemeColor] = useState<ThemeColorScheme>('light');
    const [language, setLanguage] = useState<Language>('en');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState(new Date(2025, 0, 1, 8, 0, 0, 0));
    const [showTimePicker, setShowTimePicker] = useState(false);

    const systemColorScheme = useColorScheme();
    const theme = getTheme(systemColorScheme, themeColor);

    // Load saved settings on component mount
    useEffect(() => {
        loadSettings();
    }, []);

    // Load all settings from AsyncStorage
    const loadSettings = async () => {
        try {
            const [storedTheme, storedLang, storedReminder, storedReminderTime] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.THEME),
                AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
                AsyncStorage.getItem(STORAGE_KEYS.REMINDER_ENABLED),
                AsyncStorage.getItem(STORAGE_KEYS.REMINDER_TIME),
            ]);

            if (storedTheme) setThemeColor(storedTheme as ThemeColorScheme);
            if (storedLang) setLanguage(storedLang as Language);
            if (storedReminder) setReminderEnabled(storedReminder === 'true');
            if (storedReminderTime) setReminderTime(new Date(storedReminderTime));
        } catch (error) {
            console.log('Error loading settings:', error);
        }
    };

    // Update theme setting
    const handleThemeChange = async (key: ThemeColorScheme) => {
        setThemeColor(key);
        await AsyncStorage.setItem(STORAGE_KEYS.THEME, key);
    };

    // Update language setting
    const handleLanguageChange = async (key: Language) => {
        setLanguage(key);
        await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, key);
    };

    // Toggle daily reminder setting
    const handleReminderToggle = async (value: boolean) => {
        setReminderEnabled(value);
        await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_ENABLED, value ? 'true' : 'false');

        if (value) {
            scheduleReminder(reminderTime);
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
    };

    // Update reminder time
    const handleTimeChange = async (event: any, selectedDate?: Date) => {
        setShowTimePicker(false);

        if (selectedDate) {
            setReminderTime(selectedDate);
            await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_TIME, selectedDate.toISOString());

            if (reminderEnabled) {
                scheduleReminder(selectedDate);
            }
        }
    };

    // Schedule daily reminder notification
    const scheduleReminder = async (date: Date) => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Motivo Reminder",
                body: "Don't forget to check in with your mood and goals today!",
            },
            trigger: {
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: 0,
                repeats: true,
            } as any,
        });
    };

    // Handle data export
    const handleExportData = () => {
        Alert.alert('Export Data', 'Your data export feature is coming soon!');
    };

    // Handle data deletion with confirmation
    const handleDeleteData = () => {
        Alert.alert(
            'Delete All Data',
            'Are you sure you want to delete all your data? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        Alert.alert('Deleted', 'All your data has been deleted.');
                        // Reload settings after deletion
                        loadSettings();
                    }
                }
            ]
        );
    };

    // Component for section headers
    const SectionHeader = ({ title }: { title: string }) => (
        <Text className="uppercase text-xs font-bold text-orange-400 mb-3 mt-2">
            {title}
        </Text>
    );

    // Component for settings cards
    const SettingsCard = ({ children }: { children: React.ReactNode }) => (
        <View className="bg-white dark:bg-neutral-800 rounded-xl p-4 mb-4 shadow-sm">
            {children}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900">
            <StatusBar
                barStyle={systemColorScheme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={theme.background}
            />

            <ScrollView className="flex-1 px-5">

                {/* Appearance Section */}
                <SectionHeader title="Appearance" />
                <SettingsCard>
                    <Text className="font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                        Theme
                    </Text>
                    <View className="flex-row justify-between mb-1">
                        {THEME_COLORS.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                className={`w-16 h-16 rounded-xl border-2 items-center justify-center ${themeColor === item.key ? 'border-orange-400' : 'border-neutral-200 dark:border-neutral-700'
                                    }`}
                                style={{ backgroundColor: item.color }}
                                onPress={() => handleThemeChange(item.key)}
                                activeOpacity={0.7}
                            >
                                {themeColor === item.key && (
                                    <View className="bg-orange-400 rounded-full w-5 h-5 items-center justify-center">
                                        <Text className="text-white font-bold text-xs">✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </SettingsCard>

                {/* Language Section */}
                <SectionHeader title="Language" />
                <SettingsCard>
                    <View className="flex-row flex-wrap gap-2">
                        {LANGUAGES.map(option => (
                            <TouchableOpacity
                                key={option.key}
                                className={`px-4 py-2 rounded-full ${language === option.key
                                    ? 'bg-orange-100 dark:bg-orange-900 border border-orange-400'
                                    : 'bg-neutral-200 dark:bg-neutral-700'
                                    }`}
                                onPress={() => handleLanguageChange(option.key)}
                                activeOpacity={0.7}
                            >
                                <Text className={`font-medium ${language === option.key ? 'text-orange-500' : 'text-neutral-700 dark:text-neutral-200'
                                    }`}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </SettingsCard>

                {/* Notifications Section */}
                <SectionHeader title="Notifications" />
                <SettingsCard>
                    <View className="flex-row items-center justify-between mb-1">
                        <View>
                            <Text className="font-medium text-neutral-800 dark:text-neutral-200">
                                Daily Reminder
                            </Text>
                            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                Get a gentle nudge to check in
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#e0e0e0', true: theme.accentLight }}
                            thumbColor={reminderEnabled ? theme.accent : '#f5f5f5'}
                            value={reminderEnabled}
                            onValueChange={handleReminderToggle}
                        />
                    </View>

                    {reminderEnabled && (
                        <Pressable
                            className="mt-3 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 self-start flex-row items-center"
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Ionicons name="time-outline" size={18} color={theme.accent} className="mr-2" />
                            <Text className="font-medium text-orange-500">
                                {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </Pressable>
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={reminderTime}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleTimeChange}
                        />
                    )}
                </SettingsCard>

                {/* Data & Privacy Section */}
                <SectionHeader title="Data & Privacy" />
                <SettingsCard>
                    <View className="space-y-3">
                        <Pressable
                            className="flex-row items-center justify-between py-2"
                            onPress={handleExportData}
                        >
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="download-outline" size={18} color="#3b82f6" />
                                </View>
                                <Text className="font-medium text-neutral-800 dark:text-neutral-200">
                                    Export My Data
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                        </Pressable>

                        <Pressable
                            className="flex-row items-center justify-between py-2"
                            onPress={handleDeleteData}
                        >
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                </View>
                                <Text className="font-medium text-red-500">
                                    Delete All Data
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                        </Pressable>
                    </View>
                </SettingsCard>

                {/* About & Support Section */}
                <SectionHeader title="About & Support" />
                <SettingsCard>
                    <Text className="text-neutral-600 dark:text-neutral-400 mb-3">
                        Motivo helps you track your mood, set goals, and stay motivated.
                    </Text>

                    <View className="space-y-1">
                        {SUPPORT_OPTIONS.map(option => (
                            <Pressable
                                key={option.id}
                                className="flex-row items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-700"
                                onPress={option.onPress}
                            >
                                <View className="flex-row items-center">
                                    <Ionicons name={option.icon} size={18} color={theme.accent} className="mr-3" />
                                    <Text className="font-medium text-neutral-800 dark:text-neutral-200">
                                        {option.title}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                            </Pressable>
                        ))}
                    </View>
                </SettingsCard>

                <Text className="text-center text-xs text-neutral-400 mt-6 mb-8">
                    Motivo v1.7.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;