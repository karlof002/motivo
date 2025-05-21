// screens/MoodTrackerScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { Mood, MoodEntry } from '../types';
import { useColorScheme } from 'react-native';

const MOODS: { mood: Mood; emoji: string; label: string }[] = [
    { mood: 'happy', emoji: '😀', label: 'Happy' },
    { mood: 'neutral', emoji: '😐', label: 'Neutral' },
    { mood: 'sad', emoji: '😞', label: 'Sad' },
    { mood: 'angry', emoji: '😡', label: 'Angry' },
    { mood: 'tired', emoji: '😴', label: 'Tired' },
];
const STORAGE_KEY = '@mood_entries';

function getToday(): string {
    return new Date().toISOString().slice(0, 10);
}

const MoodTrackerScreen: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const today = getToday();

    useEffect(() => {
        loadHistory();
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

    async function saveMood(mood: Mood) {
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
            Alert.alert('Saved!', 'Your mood for today has been recorded.');
        } catch {
            Alert.alert('Error', 'Could not save your mood.');
        }
    }

    return (
        <View style={[styles.container, isDark && styles.darkBg]}>
            <Text style={[styles.title, isDark && styles.darkText]}>How are you today?</Text>
            <View style={styles.emojiRow}>
                {MOODS.map(({ mood, emoji }) => (
                    <TouchableOpacity
                        key={mood}
                        style={[
                            styles.emojiButton,
                            selectedMood === mood && styles.selectedEmoji,
                            isDark && styles.darkEmoji,
                            selectedMood === mood && isDark && styles.darkSelectedEmoji,
                        ]}
                        onPress={() => saveMood(mood)}
                    >
                        <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={[styles.subtitle, isDark && styles.darkText]}>
                {selectedMood
                    ? `Today's mood: ${MOODS.find(m => m.mood === selectedMood)?.label || ''}`
                    : 'No mood recorded for today'}
            </Text>
            <Text style={[styles.historyTitle, isDark && styles.darkText]}>
                Recent Mood History
            </Text>
            <FlatList
                data={history.slice(0, 7)}
                keyExtractor={item => item.date}
                renderItem={({ item }) => {
                    const moodObj = MOODS.find(m => m.mood === item.mood);
                    return (
                        <View style={[styles.historyRow, isDark && styles.darkHistoryRow]}>
                            <Text style={styles.historyDate}>{item.date}</Text>
                            <Text style={styles.historyEmoji}>{moodObj?.emoji}</Text>
                            <Text style={[styles.historyLabel, isDark && styles.darkText]}>{moodObj?.label}</Text>
                        </View>
                    );
                }}
                style={{ width: '100%' }}
                ListEmptyComponent={
                    <Text style={[styles.empty, isDark && styles.darkText]}>
                        No mood history yet.
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7EFE5',
        padding: 24,
        alignItems: 'center',
    },
    darkBg: { backgroundColor: '#22223B' },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: '#22223B',
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 16,
        color: '#7B7B7B',
        marginVertical: 12,
        textAlign: 'center',
    },
    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emojiButton: {
        marginHorizontal: 8,
        backgroundColor: '#FFFDF6',
        borderRadius: 18,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedEmoji: {
        borderColor: '#FFD580',
        backgroundColor: '#FFF2CC',
    },
    darkEmoji: {
        backgroundColor: '#363654',
    },
    darkSelectedEmoji: {
        borderColor: '#66B6FF',
        backgroundColor: '#2C3A4B',
    },
    emoji: {
        fontSize: 32,
    },
    historyTitle: {
        marginTop: 18,
        fontSize: 18,
        fontWeight: '600',
        color: '#22223B',
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#FFFDF6',
        marginVertical: 2,
        width: '100%',
    },
    darkHistoryRow: {
        backgroundColor: '#363654',
    },
    historyDate: {
        flex: 2,
        fontSize: 15,
        color: '#9A9A9A',
    },
    historyEmoji: {
        flex: 1,
        fontSize: 22,
        textAlign: 'center',
    },
    historyLabel: {
        flex: 2,
        fontSize: 15,
        color: '#555',
        marginLeft: 6,
    },
    empty: {
        color: '#888',
        fontSize: 15,
        marginVertical: 16,
        textAlign: 'center',
    },
    darkText: { color: '#F7EFE5' },
});

export default MoodTrackerScreen;