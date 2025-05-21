// screens/JournalScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { JournalEntry } from '../types';
import { useColorScheme } from 'react-native';

function getToday(): string {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

const STORAGE_KEY = '@journal_entries';

const JournalScreen: React.FC = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [date] = useState(getToday());
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    useEffect(() => {
        loadEntry();
    }, []);

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
            Alert.alert('Saved!', 'Your journal entry was saved.');
        } catch (err) {
            Alert.alert('Error', 'Could not save your entry.');
        }
    }

    if (loading) {
        return (
            <View style={[styles.container, isDark && styles.darkBg]}>
                <Text style={{ color: isDark ? '#fff' : '#222' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, isDark && styles.darkBg]}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
            <View style={styles.titleRow}>
                <Text style={[styles.title, isDark && styles.darkText]}>Journal</Text>
                <Text style={[styles.date, isDark && styles.darkText]}>{date}</Text>
            </View>
            <TextInput
                style={[
                    styles.input,
                    isDark && styles.darkInput,
                ]}
                multiline
                placeholder="Write your thoughts..."
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
            />
            <MotivoButton title="Save Entry" onPress={saveEntry} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7EFE5',
        padding: 24,
    },
    darkBg: {
        backgroundColor: '#22223B',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#22223B',
        letterSpacing: 0.3,
    },
    date: {
        fontSize: 16,
        color: '#888',
    },
    input: {
        backgroundColor: '#FFFDF6',
        borderRadius: 18,
        minHeight: 160,
        fontSize: 16,
        color: '#22223B',
        padding: 18,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    darkInput: {
        backgroundColor: '#363654',
        color: '#F7EFE5',
    },
    darkText: {
        color: '#F7EFE5',
    },
});

export default JournalScreen;