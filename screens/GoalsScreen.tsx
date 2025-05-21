import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Animated,
    useColorScheme,
    Keyboard,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = '@weekly_goals';
const MAX_GOALS = 3;

type Goal = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
};

const GoalsScreen: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [input, setInput] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#F9FAFB',
        },
        contentContainer: {
            padding: 20,
            paddingBottom: 40,
        },
        header: {
            marginBottom: 24,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 6,
            color: isDark ? '#F9FAFB' : '#1F2937',
        },
        subtitle: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        card: {
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 24,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            shadowColor: isDark ? '#000000' : '#1F2937',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.25 : 0.05,
            shadowRadius: isDark ? 8 : 4,
            elevation: 2,
        },
        emptyContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
        },
        emptyText: {
            fontSize: 16,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
        },
        goalItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#374151' : '#F3F4F6',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        checkbox: {
            width: 20,
            height: 20,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        checkedBox: {
            backgroundColor: '#6366F1',
            borderColor: '#6366F1',
            borderWidth: 1,
        },
        uncheckedBox: {
            borderWidth: 1,
            borderColor: isDark ? '#6B7280' : '#9CA3AF',
        },
        checkmark: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
        },
        goalText: {
            flex: 1,
            fontSize: 16,
        },
        completedText: {
            color: isDark ? '#6B7280' : '#9CA3AF',
            textDecorationLine: 'line-through',
        },
        activeText: {
            color: isDark ? '#F9FAFB' : '#1F2937',
        },
        inputContainer: {
            marginBottom: 24,
        },
        input: {
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            fontSize: 16,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#1F2937',
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        buttonSpacer: {
            width: 12,
        },
        deleteAction: {
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginVertical: 1,
            paddingHorizontal: 20,
            width: 96,
            backgroundColor: '#EF4444',
        },
        deleteText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '500',
        },
        progressContainer: {
            marginBottom: 24,
        },
        progressText: {
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        progressBar: {
            height: 6,
            borderRadius: 100,
            overflow: 'hidden',
            backgroundColor: isDark ? '#374151' : '#F3F4F6',
        },
        progressFill: {
            height: '100%',
            borderRadius: 100,
            backgroundColor: isDark ? '#6366F1' : '#4F46E5',
        },
    });

    const loadGoals = useCallback(async () => {
        setIsLoading(true);
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const parsedGoals = stored ? JSON.parse(stored) : [];

            // Sort goals by completion status and creation date
            const sortedGoals = [...parsedGoals].sort((a, b) => {
                if (a.completed === b.completed) {
                    return (b.createdAt || 0) - (a.createdAt || 0);
                }
                return a.completed ? 1 : -1;
            });

            setGoals(sortedGoals);
        } catch (error) {
            console.error('Failed to load goals:', error);
            Alert.alert('Error', 'Failed to load your goals. Please try again.');
            setGoals([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveGoals = useCallback(async (newGoals: Goal[]) => {
        try {
            const sortedGoals = [...newGoals].sort((a, b) => {
                if (a.completed === b.completed) {
                    return (b.createdAt || 0) - (a.createdAt || 0);
                }
                return a.completed ? 1 : -1;
            });

            setGoals(sortedGoals);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortedGoals));
        } catch (error) {
            console.error('Failed to save goals:', error);
            Alert.alert('Error', 'Failed to save your changes. Please try again.');
        }
    }, []);

    const handleAddGoal = useCallback(() => {
        if (!input.trim()) return;

        if (goals.length >= MAX_GOALS) {
            Alert.alert('Limit reached', `You can only set up to ${MAX_GOALS} goals.`);
            return;
        }

        const newGoal: Goal = {
            id: Date.now().toString(),
            text: input.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        saveGoals([...goals, newGoal]);
        setInput('');
        setIsAdding(false);
        Keyboard.dismiss();
    }, [goals, input, saveGoals]);

    const handleToggleGoal = useCallback((id: string) => {
        const updated = goals.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        );
        saveGoals(updated);
    }, [goals, saveGoals]);

    const handleDeleteGoal = useCallback((id: string) => {
        Alert.alert(
            'Delete Goal',
            'Are you sure you want to delete this goal?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const updated = goals.filter(goal => goal.id !== id);
                        saveGoals(updated);
                    }
                },
            ]
        );
    }, [goals, saveGoals]);

    const renderRightActions = useCallback((id: string) => (
        <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => handleDeleteGoal(id)}
        >
            <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
    ), [handleDeleteGoal, styles.deleteAction, styles.deleteText]);

    useEffect(() => {
        loadGoals();
    }, [loadGoals]);

    // Progress bar calculation
    const completed = goals.filter(g => g.completed).length;
    const progress = goals.length > 0 ? completed / goals.length : 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Weekly Goals</Text>
                        <Text style={styles.subtitle}>
                            Focus on {MAX_GOALS} important goals this week
                        </Text>
                    </View>

                    {/* Goals List */}
                    <View style={styles.card}>
                        {isLoading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Loading goals...</Text>
                            </View>
                        ) : goals.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No goals yet. Add your first goal below!
                                </Text>
                            </View>
                        ) : (
                            goals.map((item, index) => (
                                <Swipeable key={item.id} renderRightActions={() => renderRightActions(item.id)}>
                                    <View
                                        style={[
                                            styles.goalItem,
                                            // Remove bottom border for last item
                                            index === goals.length - 1 && { borderBottomWidth: 0 }
                                        ]}
                                    >
                                        <Pressable
                                            style={[
                                                styles.checkbox,
                                                item.completed ? styles.checkedBox : styles.uncheckedBox
                                            ]}
                                            onPress={() => handleToggleGoal(item.id)}
                                            android_ripple={{
                                                color: 'rgba(99, 102, 241, 0.2)',
                                                radius: 22,
                                                borderless: true
                                            }}
                                        >
                                            {item.completed && (
                                                <Text style={styles.checkmark}>✓</Text>
                                            )}
                                        </Pressable>
                                        <Text
                                            style={[
                                                styles.goalText,
                                                item.completed ? styles.completedText : styles.activeText
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {item.text}
                                        </Text>
                                    </View>
                                </Swipeable>
                            ))
                        )}
                    </View>

                    {/* Add Goal Input or Button */}
                    {isAdding ? (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={input}
                                onChangeText={setInput}
                                placeholder="What do you want to accomplish?"
                                placeholderTextColor={isDark ? "#9CA3AF" : "#9CA3AF"}
                                autoFocus
                                maxLength={100}
                                returnKeyType="done"
                                onSubmitEditing={handleAddGoal}
                            />
                            <View style={styles.buttonRow}>
                                <MotivoButton
                                    title="Cancel"
                                    onPress={() => {
                                        setInput('');
                                        setIsAdding(false);
                                    }}
                                    variant="outline"
                                    style={{ flex: 1 }}
                                />
                                <View style={styles.buttonSpacer} />
                                <MotivoButton
                                    title="Add Goal"
                                    onPress={handleAddGoal}
                                    style={{ flex: 1 }}
                                    disabled={!input.trim()}
                                />
                            </View>
                        </View>
                    ) : (
                        <MotivoButton
                            title={`${goals.length >= MAX_GOALS ? 'Goal limit reached' : 'Add goal'}`}
                            onPress={() => setIsAdding(true)}
                            fullWidth
                            style={{ marginBottom: 24 }}
                            variant={goals.length >= MAX_GOALS ? "outline" : "primary"}
                            disabled={goals.length >= MAX_GOALS}
                        />
                    )}

                    {/* Progress Bar */}
                    {goals.length > 0 && (
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                {completed} of {goals.length} completed
                            </Text>
                            <View style={styles.progressBar}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progress * 100}%` }
                                    ]}
                                />
                            </View>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default GoalsScreen;