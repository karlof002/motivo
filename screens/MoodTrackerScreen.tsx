// screens/MoodTrackerScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    Animated,
    ScrollView,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { Mood, MoodEntry } from '../types';
import { useColorScheme } from 'react-native';
import { getTheme, spacing, roundness, typography, elevation } from '@theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

const MOODS: {
    mood: Mood;
    emoji: string;
    label: string;
    description: string;
    gradient: [string, string];  // Explicitly typed as tuple for LinearGradient
}[] = [
        {
            mood: 'happy',
            emoji: '😀',
            label: 'Happy',
            description: 'Feeling good today!',
            gradient: ['#FFD580', '#FFA726']
        },
        {
            mood: 'neutral',
            emoji: '😐',
            label: 'Neutral',
            description: 'Just average',
            gradient: ['#E0E0E0', '#BDBDBD']
        },
        {
            mood: 'sad',
            emoji: '😞',
            label: 'Sad',
            description: 'Feeling down',
            gradient: ['#90CAF9', '#42A5F5']
        },
        {
            mood: 'angry',
            emoji: '😡',
            label: 'Angry',
            description: 'Feeling frustrated',
            gradient: ['#EF9A9A', '#EF5350']
        },
        {
            mood: 'tired',
            emoji: '😴',
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
    const colorScheme = useColorScheme();
    const theme = getTheme(colorScheme);
    const today = getToday();

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

            // Show feedback animation instead of Alert
            const moodInfo = MOODS.find(m => m.mood === mood);
            const feedbackText = `Your mood is now set to ${moodInfo?.label}`;

            // Could implement a custom animated feedback here
            // For now, still using Alert but with improved messaging
            Alert.alert('Mood Tracked', feedbackText);
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

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header with dynamic gradient based on dominant mood */}
            <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }}>
                <LinearGradient
                    colors={moodGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.headerBox,
                        elevation.small
                    ]}
                >
                    <Text style={[styles.greeting, {
                        color: '#FFFFFF',
                        textShadowColor: 'rgba(0,0,0,0.1)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2
                    }]}>
                        How are you today?
                    </Text>
                    <Text style={[styles.date, { color: 'rgba(255,255,255,0.9)' }]}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </Text>
                    <View style={styles.streakBadge}>
                        <Text style={styles.streakText}>
                            {streak > 1 ? `${streak} Day Streak!` : 'Start your streak today!'}
                        </Text>
                    </View>
                </LinearGradient>
            </Animated.View>

            <View style={styles.moodSection}>
                <View style={styles.emojiRow}>
                    {MOODS.map(({ mood, emoji, label, gradient }, index) => (
                        <Animated.View
                            key={mood}
                            style={{
                                transform: [{ scale: scaleAnim[index] }],
                                opacity: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1]
                                }),
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => saveMood(mood, index)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={selectedMood === mood ? gradient : ['#FFFFFF', '#F8F8F8']}
                                    style={[
                                        styles.emojiButton,
                                        selectedMood === mood && {
                                            borderColor: gradient[0],
                                        },
                                        elevation.small
                                    ]}
                                >
                                    <Text style={styles.emoji}>{emoji}</Text>
                                    <Text style={[
                                        styles.emojiLabel,
                                        { color: selectedMood === mood ? '#FFFFFF' : theme.textSecondary }
                                    ]}>
                                        {label}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </View>

            <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }}>
                <View style={[styles.historySection, { backgroundColor: theme.card, borderTopColor: theme.divider }, elevation.small]}>
                    <Text style={[styles.historyTitle, { color: theme.text }]}>
                        Mood History
                    </Text>
                    <View style={styles.historyContent}>
                        {history.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                    No mood history yet. Start by selecting today's mood above!
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={history.slice(0, 7)}
                                keyExtractor={item => item.date}
                                renderItem={({ item }) => {
                                    const moodObj = MOODS.find(m => m.mood === item.mood);
                                    return (
                                        <View style={[
                                            styles.historyRow,
                                            { borderBottomColor: theme.divider }
                                        ]}>
                                            <View style={styles.historyLeft}>
                                                <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
                                                    {formatDate(item.date)}
                                                </Text>
                                                <Text style={[styles.historyLabel, { color: theme.text }]}>
                                                    {moodObj?.label}
                                                </Text>
                                            </View>
                                            <LinearGradient
                                                colors={moodObj?.gradient || ['#E0E0E0', '#BDBDBD']}
                                                style={styles.emojiCircle}
                                            >
                                                <Text style={styles.historyEmoji}>{moodObj?.emoji}</Text>
                                            </LinearGradient>
                                        </View>
                                    );
                                }}
                                style={{ width: '100%' }}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                </View>
            </Animated.View>

            {/* Mood insights section - new addition */}
            {history.length > 0 && (
                <Animated.View style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}>
                    <View style={[
                        styles.insightsSection,
                        {
                            backgroundColor: theme.backgroundAlt,
                            borderColor: theme.divider
                        }
                    ]}>
                        <Text style={[styles.insightsTitle, { color: theme.text }]}>
                            Insights
                        </Text>
                        <Text style={[styles.insightsText, { color: theme.textSecondary }]}>
                            You've tracked your mood {history.length} {history.length === 1 ? 'time' : 'times'}.
                            {streak > 2 && ` You're on a ${streak}-day streak!`}
                        </Text>
                    </View>
                </Animated.View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: spacing.xxl,
    },
    headerBox: {
        borderRadius: roundness.lg,
        padding: spacing.lg,
        margin: spacing.lg,
        marginBottom: spacing.md,
        alignItems: 'center',
    },
    greeting: {
        ...typography.title,
        marginBottom: spacing.xs,
    },
    date: {
        ...typography.bodySmall,
        marginBottom: spacing.sm,
    },
    streakBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: roundness.full,
        marginTop: spacing.sm,
    },
    streakText: {
        ...typography.bodySmall,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    moodSection: {
        paddingVertical: spacing.md,
    },
    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: spacing.md,
        flexWrap: 'wrap',
    },
    emojiButton: {
        width: 80,
        height: 100,
        borderRadius: roundness.md,
        marginHorizontal: spacing.xs,
        marginVertical: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    emoji: {
        fontSize: 36,
        marginBottom: spacing.sm,
    },
    emojiLabel: {
        ...typography.bodySmall,
        fontWeight: '600',
    },
    historySection: {
        flex: 1,
        borderTopWidth: 1,
        borderTopLeftRadius: roundness.xl,
        borderTopRightRadius: roundness.xl,
        paddingTop: spacing.lg,
        marginTop: spacing.md,
        paddingBottom: spacing.lg,
    },
    historyTitle: {
        ...typography.subtitle,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    historyContent: {
        flex: 1,
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
    },
    historyLeft: {
        flex: 1,
    },
    historyDate: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    historyLabel: {
        ...typography.body,
        fontWeight: '500',
    },
    emojiCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyEmoji: {
        fontSize: 22,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        ...typography.body,
        textAlign: 'center',
    },
    insightsSection: {
        margin: spacing.lg,
        marginTop: 0,
        padding: spacing.md,
        borderRadius: roundness.md,
        borderWidth: 1,
    },
    insightsTitle: {
        ...typography.subtitle,
        marginBottom: spacing.xs,
    },
    insightsText: {
        ...typography.body,
    }
});

export default MoodTrackerScreen;