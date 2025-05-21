import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    Animated,
    ScrollView,
    StatusBar,
    useWindowDimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Mood, MoodEntry } from '../types';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOODS: {
    mood: Mood;
    emoji: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    description: string;
    gradient: [string, string];
}[] = [
        {
            mood: 'happy',
            emoji: '😀',
            icon: 'emoticon-happy-outline',
            label: 'Happy',
            description: 'Feeling good today!',
            gradient: ['#FFD580', '#FFA726']
        },
        {
            mood: 'neutral',
            emoji: '😐',
            icon: 'emoticon-neutral-outline',
            label: 'Neutral',
            description: 'Just average',
            gradient: ['#E0E0E0', '#BDBDBD']
        },
        {
            mood: 'sad',
            emoji: '😞',
            icon: 'emoticon-sad-outline',
            label: 'Sad',
            description: 'Feeling down',
            gradient: ['#90CAF9', '#42A5F5']
        },
        {
            mood: 'angry',
            emoji: '😡',
            icon: 'emoticon-angry-outline',
            label: 'Angry',
            description: 'Feeling frustrated',
            gradient: ['#EF9A9A', '#EF5350']
        },
        {
            mood: 'tired',
            emoji: '😴',
            icon: 'sleep',
            label: 'Tired',
            description: 'Low energy',
            gradient: ['#CE93D8', '#AB47BC']
        },
    ];

const STORAGE_KEY = '@mood_entries';

function getToday(): string {
    return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().slice(0, 10)) {
        return 'Today';
    } else if (dateStr === yesterday.toISOString().slice(0, 10)) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
}

const MoodTrackerScreen: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMood, setFeedbackMood] = useState<Mood | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const today = getToday();
    const { width } = useWindowDimensions();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef<Animated.Value[]>(
        MOODS.map(() => new Animated.Value(1))
    ).current;

    useEffect(() => {
        loadHistory();

        // Fade in animation
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

    async function loadHistory() {
        setLoading(true);
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const entries: MoodEntry[] = stored ? JSON.parse(stored) : [];
            setHistory(entries);
            const todayEntry = entries.find(e => e.date === today);
            setSelectedMood(todayEntry?.mood || null);
        } catch {
            setHistory([]);
        }
        setLoading(false);
    }

    async function saveMood(mood: Mood, index: number) {
        // Button press animation
        Animated.sequence([
            Animated.timing(scaleAnim[index], {
                toValue: 0.85,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim[index], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();

        try {
            let updated: MoodEntry[];
            const existingEntry = history.find(e => e.date === today);
            if (existingEntry) {
                updated = history.map(e =>
                    e.date === today ? { ...e, mood } : e
                );
            } else {
                updated = [{ date: today, mood }, ...history];
            }
            setHistory(updated);
            setSelectedMood(mood);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

            // Show visual feedback instead of alert
            setFeedbackMood(mood);
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 2000);
        } catch {
            Alert.alert('Error', 'Could not save your mood.');
        }
    }

    // Get streak data and weekly stats
    const streak = history.reduce((count, entry, index, arr) => {
        // Check if we have continuous days
        if (index === 0) return 1;
        const currentDate = new Date(entry.date);
        const prevDate = new Date(arr[index - 1].date);
        const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1 ? count + 1 : count;
    }, 0);

    // Calculate dominant mood for the streak visualization
    const dominantMood = history.length > 0
        ? history
            .slice(0, Math.min(7, history.length))
            .reduce((acc, entry) => {
                acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        : {};

    const primaryMood = Object.entries(dominantMood).sort((a, b) => b[1] - a[1])[0]?.[0] as Mood || 'neutral';
    const moodGradient = MOODS.find(m => m.mood === primaryMood)?.gradient || ['#E0E0E0', '#BDBDBD'];

    // Calculate mood distribution for graph
    const moodCounts = MOODS.reduce((acc, { mood }) => {
        acc[mood] = history.filter(entry => entry.mood === mood).length;
        return acc;
    }, {} as Record<string, number>);

    const maxCount = Math.max(...Object.values(moodCounts), 1);

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Custom feedback toast */}
            {showFeedback && feedbackMood && (
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 300 }}
                    className="absolute top-10 self-center z-50"
                    style={{ width: width * 0.8 }}
                >
                    <BlurView
                        intensity={80}
                        tint={isDark ? 'dark' : 'light'}
                        className="rounded-xl overflow-hidden"
                    >
                        <LinearGradient
                            colors={MOODS.find(m => m.mood === feedbackMood)?.gradient || ['#E0E0E0', '#BDBDBD']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="px-4 py-3 flex-row items-center"
                        >
                            <View className="mr-3 bg-white/30 p-2 rounded-full">
                                <Text className="text-xl">
                                    {MOODS.find(m => m.mood === feedbackMood)?.emoji}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-white font-bold text-base">
                                    Mood Tracked
                                </Text>
                                <Text className="text-white/90 text-sm">
                                    Feeling {MOODS.find(m => m.mood === feedbackMood)?.label.toLowerCase()}
                                </Text>
                            </View>
                        </LinearGradient>
                    </BlurView>
                </MotiView>
            )}

            <ScrollView
                className="flex-1"
                contentContainerClassName="pb-12"
                showsVerticalScrollIndicator={false}
            >
                {/* Header with dynamic gradient based on dominant mood */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        type: 'timing',
                        duration: 600,
                        easing: Easing.out(Easing.quad)
                    }}
                >
                    <LinearGradient
                        colors={moodGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="m-4 mb-6 p-6 rounded-3xl items-center shadow-lg"
                    >
                        <Text className="text-3xl font-bold mb-1 text-white"
                            style={{
                                textShadowColor: 'rgba(0,0,0,0.15)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 3
                            }}
                        >
                            How are you today?
                        </Text>
                        <Text className="text-base text-white/90 mb-4">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </Text>
                        <View className="mt-2 bg-white/30 px-5 py-2 rounded-full">
                            <Text className="text-base font-bold text-white">
                                {streak > 1 ? `${streak} Day Streak! 🔥` : 'Start your streak today! ✨'}
                            </Text>
                        </View>
                    </LinearGradient>
                </MotiView>

                {/* Mood selector */}
                <View className="py-2 px-4">
                    <View className="flex-row flex-wrap justify-center">
                        {MOODS.map(({ mood, icon, label, gradient }, index) => {
                            const delay = index * 100;
                            const isSelected = selectedMood === mood;

                            return (
                                <MotiView
                                    key={mood}
                                    from={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: 'timing',
                                        duration: 400,
                                        delay,
                                        easing: Easing.out(Easing.back())
                                    }}
                                    className="m-2"
                                >
                                    <TouchableOpacity
                                        onPress={() => saveMood(mood, index)}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={isSelected ? gradient : isDark ? ['#2D3748', '#1A202C'] : ['#FFFFFF', '#F8F8F8']}
                                            className={`w-24 h-24 rounded-2xl items-center justify-center shadow-md`}
                                            style={{
                                                shadowColor: isSelected ? gradient[0] : '#000',
                                                shadowOffset: { width: 0, height: 3 },
                                                shadowOpacity: isSelected ? 0.4 : 0.1,
                                                shadowRadius: 4,
                                                elevation: isSelected ? 5 : 2,
                                            }}
                                        >
                                            <View
                                                className={`w-12 h-12 rounded-full items-center justify-center mb-2
                                                ${isSelected ? 'bg-white/30' : isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                                            >
                                                <MaterialCommunityIcons
                                                    name={icon}
                                                    size={26}
                                                    color={isSelected ? '#FFFFFF' : isDark ? '#E2E8F0' : '#4A5568'}
                                                />
                                            </View>
                                            <Text
                                                className={`text-sm font-semibold
                                                ${isSelected ? 'text-white' : isDark ? 'text-gray-200' : 'text-gray-700'}`}
                                            >
                                                {label}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </MotiView>
                            );
                        })}
                    </View>
                </View>

                {/* History Section with Glass Effect */}
                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        type: 'timing',
                        duration: 600,
                        delay: 300,
                        easing: Easing.out(Easing.quad)
                    }}
                    className="mt-6"
                >
                    <View className={`flex-1 rounded-t-3xl pt-6 pb-6 shadow-md
                        ${isDark ? 'bg-gray-800/90' : 'bg-white/90'}`}
                    >
                        <View className="flex-row justify-between items-center mx-6 mb-4">
                            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Mood History
                            </Text>
                            {history.length > 0 && (
                                <TouchableOpacity
                                    className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                                >
                                    <Text className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        See All
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View className="flex-1">
                            {history.length === 0 ? (
                                <View className="p-8 items-center justify-center">
                                    <MaterialCommunityIcons
                                        name="calendar-blank-outline"
                                        size={48}
                                        color={isDark ? '#4A5568' : '#CBD5E0'}
                                    />
                                    <Text className={`text-base text-center mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No mood history yet. Start by selecting today's mood above!
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={history.slice(0, 7)}
                                    keyExtractor={item => item.date}
                                    renderItem={({ item, index }) => {
                                        const moodObj = MOODS.find(m => m.mood === item.mood);
                                        return (
                                            <MotiView
                                                from={{ opacity: 0, translateX: 20 }}
                                                animate={{ opacity: 1, translateX: 0 }}
                                                transition={{
                                                    delay: index * 50,
                                                    duration: 350,
                                                    easing: Easing.out(Easing.quad)
                                                }}
                                            >
                                                <View className={`flex-row justify-between items-center py-4 mx-6 
                                                    ${index < history.slice(0, 7).length - 1 ?
                                                        (isDark ? 'border-b border-gray-700/50' : 'border-b border-gray-200/70') : ''}`}
                                                >
                                                    <View className="flex-1">
                                                        <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {formatDate(item.date)}
                                                        </Text>
                                                        <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                                            {moodObj?.label}
                                                        </Text>
                                                    </View>
                                                    <LinearGradient
                                                        colors={moodObj?.gradient || ['#E0E0E0', '#BDBDBD']}
                                                        className="w-12 h-12 rounded-full items-center justify-center shadow-sm"
                                                    >
                                                        <MaterialCommunityIcons
                                                            name={moodObj?.icon || 'emoticon-neutral-outline'}
                                                            size={24}
                                                            color="#FFFFFF"
                                                        />
                                                    </LinearGradient>
                                                </View>
                                            </MotiView>
                                        );
                                    }}
                                    style={{ width: '100%' }}
                                    scrollEnabled={false}
                                />
                            )}
                        </View>
                    </View>
                </MotiView>

                {/* Mood insights section with visual graph */}
                {history.length > 0 && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{
                            type: 'timing',
                            duration: 600,
                            delay: 500,
                            easing: Easing.out(Easing.quad)
                        }}
                    >
                        <View className={`mx-4 mt-4 p-5 rounded-2xl border shadow-sm
                            ${isDark ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200/50'}`}
                        >
                            <Text className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Mood Insights
                            </Text>

                            <View className="flex-row items-end justify-around mb-4 mt-2">
                                {MOODS.map(({ mood, icon, gradient }) => {
                                    const count = moodCounts[mood] || 0;
                                    const height = Math.max(10, (count / maxCount) * 100);

                                    return (
                                        <View key={mood} className="items-center">
                                            <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {count}
                                            </Text>
                                            <MotiView
                                                from={{ height: 10 }}
                                                animate={{ height }}
                                                transition={{
                                                    type: 'timing',
                                                    duration: 800,
                                                    delay: 200,
                                                }}
                                            >
                                                <LinearGradient
                                                    colors={gradient}
                                                    className="w-8 rounded-full"
                                                    style={{ height }}
                                                />
                                            </MotiView>
                                            <View className="mt-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                                <MaterialCommunityIcons
                                                    name={icon}
                                                    size={16}
                                                    color={gradient[0]}
                                                />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>

                            <Text className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                You've tracked your mood {history.length} {history.length === 1 ? 'time' : 'times'}.
                                {streak > 2 && ` You're on a ${streak}-day streak! 🔥`}
                            </Text>

                            {history.length >= 3 && (
                                <View className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100/80'}`}>
                                    <Text className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Most frequent mood: <Text className="font-bold">{MOODS.find(m => m.mood === primaryMood)?.label}</Text>
                                    </Text>
                                </View>
                            )}
                        </View>
                    </MotiView>
                )}
            </ScrollView>
        </View>
    );
};

export default MoodTrackerScreen;