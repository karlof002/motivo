// screens/JournalScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
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
import { getTheme, spacing, roundness, typography, elevation } from '../theme/theme';

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

const JournalScreen: React.FC = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [date] = useState(getToday());
    const [characterCount, setCharacterCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [savedStatus, setSavedStatus] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const colorScheme = useColorScheme();
    const theme = getTheme(colorScheme);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadEntry();
    }, []);

    useEffect(() => {
        setCharacterCount(text.length);
    }, [text]);

    useEffect(() => {
        if (savedStatus) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.delay(1500),
                Animated.timing(fadeAnim, {
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

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Loading your journal...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                ref={scrollViewRef}
                bounces={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Journal</Text>
                    <Text style={[styles.date, { color: theme.textSecondary }]}>
                        {formatDate(date)}
                    </Text>
                </View>

                {/* Visual prompt */}
                <View style={[styles.promptCard, { backgroundColor: theme.accentLight }]}>
                    <Text style={[styles.promptText, { color: theme.text }]}>
                        How was your day? What made you feel proud or grateful?
                    </Text>
                </View>

                <View style={[
                    styles.inputContainer,
                    {
                        backgroundColor: theme.card,
                        shadowColor: theme.shadow
                    },
                    elevation.medium
                ]}>
                    <TextInput
                        style={[
                            styles.input,
                            { color: theme.text, backgroundColor: theme.card }
                        ]}
                        multiline
                        placeholder="Write your thoughts..."
                        placeholderTextColor={theme.textSecondary}
                        value={text}
                        onChangeText={setText}
                        textAlignVertical="top"
                    />
                    <View style={styles.inputFooter}>
                        <Text style={[styles.counter, { color: theme.textSecondary }]}>
                            {characterCount} characters
                        </Text>
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    <MotivoButton
                        title="Save Entry"
                        onPress={saveEntry}
                        loading={isSaving}
                        fullWidth
                    />
                </View>

                {/* Save status notification */}
                <Animated.View
                    style={[
                        styles.saveNotification,
                        {
                            backgroundColor: savedStatus.includes('Error') ? theme.error : theme.success,
                            opacity: fadeAnim
                        }
                    ]}
                    pointerEvents="none"
                >
                    <Text style={styles.saveNotificationText}>{savedStatus}</Text>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.title,
    },
    date: {
        ...typography.bodySmall,
    },
    promptCard: {
        borderRadius: roundness.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    promptText: {
        ...typography.bodySmall,
        fontStyle: 'italic',
    },
    inputContainer: {
        borderRadius: roundness.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
    },
    input: {
        minHeight: 200,
        maxHeight: 500,
        ...typography.body,
        padding: spacing.md,
        textAlignVertical: 'top',
    },
    inputFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    counter: {
        ...typography.caption,
    },
    actionContainer: {
        marginTop: spacing.sm,
    },
    saveNotification: {
        position: 'absolute',
        bottom: spacing.xxl,
        left: spacing.xl,
        right: spacing.xl,
        padding: spacing.md,
        borderRadius: roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveNotificationText: {
        color: 'white',
        ...typography.body,
    },
});

export default JournalScreen;