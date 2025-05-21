// screens/JournalScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated,
    TouchableOpacity,
    ScrollView,
    useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { JournalEntry } from '../types';
import { getTheme } from '@theme/theme';
import { Feather } from '@expo/vector-icons';

function getToday(): string {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

const STORAGE_KEY = '@journal_entries';
const PROMPTS = [
    "How was your day? What made you feel proud or grateful?",
    "What's something you learned today?",
    "What's one small win you had today?",
    "What are you looking forward to tomorrow?",
    "Who made a positive impact on your day?",
];

const JournalScreen: React.FC = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [date] = useState(getToday());
    const [characterCount, setCharacterCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [savedStatus, setSavedStatus] = useState('');
    const [prompt, setPrompt] = useState(PROMPTS[0]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const colorScheme = useColorScheme();
    const theme = getTheme(colorScheme);
    const scrollViewRef = useRef<ScrollView>(null);

    const isDark = colorScheme === 'dark';

    useEffect(() => {
        loadEntry();
        setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

        // Animate entry
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    useEffect(() => {
        setCharacterCount(text.length);
    }, [text]);

    const notificationAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (savedStatus) {
            Animated.sequence([
                Animated.timing(notificationAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.delay(1500),
                Animated.timing(notificationAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start(() => setSavedStatus(''));
        }
    }, [savedStatus]);

    async function loadEntry() {
        setLoading(true);
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const entries: JournalEntry[] = JSON.parse(stored);
                const todayEntry = entries.find(e => e.date === date);
                setText(todayEntry?.text || '');
            }
        } catch {
            // ignore
        }
        setLoading(false);
    }

    async function saveEntry() {
        if (text.trim().length === 0) {
            Alert.alert("Empty Entry", "Please write something before saving.");
            return;
        }

        setIsSaving(true);
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            let entries: JournalEntry[] = stored ? JSON.parse(stored) : [];
            const idx = entries.findIndex(e => e.date === date);
            if (idx >= 0) {
                entries[idx].text = text;
            } else {
                entries.push({ date, text });
            }
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
            setSavedStatus('Saved successfully');
        } catch (err) {
            setSavedStatus('Error saving');
        } finally {
            setIsSaving(false);
        }
    }

    const getRandomPrompt = () => {
        const newPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
        setPrompt(newPrompt);
    };


    return (

        <KeyboardAvoidingView
            className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                className="flex-1"
                contentContainerClassName="p-5 pb-32"
                ref={scrollViewRef}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }}
                >
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Journal</Text>
                        <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatDate(date)}
                        </Text>
                    </View>

                    {/* Visual prompt with refresh option */}
                    <View className={`rounded-lg p-4 mb-5 relative ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                        <Text className={`text-base italic pr-8 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                            {prompt}
                        </Text>
                        <TouchableOpacity
                            className="absolute top-2 right-2 p-1"
                            onPress={getRandomPrompt}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Feather
                                name="refresh-cw"
                                size={14}
                                color={isDark ? theme.accent : "#6366f1"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className={`rounded-xl overflow-hidden mb-5 ${isDark ? "bg-gray-800 shadow-lg shadow-black/50" : "bg-white shadow-md shadow-gray-300"}`}>
                        <TextInput
                            className={`min-h-[220] max-h-[500] p-4 text-base ${isDark ? "text-white bg-gray-800" : "text-gray-800 bg-white"}`}
                            multiline
                            placeholder="Write your thoughts..."
                            placeholderTextColor={isDark ? theme.textSecondary : "#9ca3af"}
                            value={text}
                            onChangeText={setText}
                            textAlignVertical="top"
                            selectionColor={theme.accent}
                        />
                        <View className={`flex-row justify-end p-2 ${isDark ? "border-t border-gray-700" : "border-t border-gray-100"}`}>
                            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {characterCount} characters
                            </Text>
                        </View>
                    </View>

                    <View className="mt-4">
                        <MotivoButton
                            title="Save Entry"
                            onPress={saveEntry}
                            loading={isSaving}
                            fullWidth
                        />
                    </View>
                </Animated.View>

                {/* Save status notification */}
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            bottom: 48,
                            left: 20,
                            right: 20,
                            padding: 16,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: savedStatus.includes('Error') ?
                                (isDark ? '#b91c1c' : '#ef4444') :
                                (isDark ? '#065f46' : '#10b981'),
                            opacity: fadeAnim,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5
                        }
                    ]}
                    pointerEvents="none"
                >
                    <Text className="text-white text-base flex-row items-center">
                        {savedStatus.includes('Error') ?
                            <Feather name="alert-circle" size={16} /> :
                            <Feather name="check-circle" size={16} />
                        } {savedStatus}
                    </Text>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default JournalScreen;