// screens/GoalsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    Animated,
    useColorScheme,
    Keyboard,
    Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { Goal } from '../types';
import { getTheme, spacing, roundness, typography, elevation } from '@theme/theme';
import { Swipeable } from 'react-native-gesture-handler';

const STORAGE_KEY = '@weekly_goals';
const MAX_GOALS = 3;

const GoalsScreen: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [input, setInput] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const colorScheme = useColorScheme();
    const theme = getTheme(colorScheme, 'minimal'); // Set default theme to minimal

    // Animation values - more subtle for minimalism
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.98)).current; // Less scale difference

    useEffect(() => {
        loadGoals();

        // Minimal fade in animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700, // Slower, more subtle animation
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, { // Simpler animation for minimalism
                toValue: 1,
                duration: 700,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    async function loadGoals() {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            setGoals(stored ? JSON.parse(stored) : []);
        } catch {
            setGoals([]);
        }
    }

    async function saveGoals(newGoals: Goal[]) {
        setGoals(newGoals);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
    }

    function handleAddGoal() {
        if (!input.trim()) return;
        if (goals.length >= MAX_GOALS) {
            Alert.alert('Limit reached', `You can only set up to ${MAX_GOALS} goals.`);
            return;
        }

        const newGoal: Goal = {
            id: Date.now().toString(),
            text: input.trim(),
            completed: false,
        };

        // Simpler animation for minimalism
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start();

        saveGoals([...goals, newGoal]);
        setInput('');
        setIsAdding(false);
        Keyboard.dismiss();
    }

    function handleToggleGoal(id: string) {
        const updated = goals.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        );
        saveGoals(updated);
    }

    function handleDeleteGoal(id: string) {
        const updated = goals.filter(goal => goal.id !== id);
        saveGoals(updated);
    }

    const renderRightActions = (id: string) => {
        return (
            <TouchableOpacity
                style={[
                    styles.deleteAction,
                    { backgroundColor: theme.error }
                ]}
                onPress={() => handleDeleteGoal(id)}
            >
                <Text style={styles.deleteActionText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.View
                style={[
                    styles.headerSection,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <Text style={[styles.title, { color: theme.text }]}>Weekly Goals</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Focus on {MAX_GOALS} important goals this week
                </Text>
            </Animated.View>

            <View style={[
                styles.goalsContainer,
                {
                    backgroundColor: theme.card,
                    borderColor: theme.divider
                },
                elevation.small
            ]}>
                {goals.length === 0 ? (
                    <Animated.View
                        style={[
                            styles.emptyContainer,
                            { opacity: fadeAnim }
                        ]}
                    >
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No goals yet
                        </Text>
                    </Animated.View>
                ) : (
                    <FlatList
                        data={goals}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => (
                            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                                <Animated.View
                                    style={[
                                        styles.goalRow,
                                        {
                                            backgroundColor: theme.backgroundAlt,
                                            borderBottomColor: theme.divider,
                                            opacity: fadeAnim,
                                        }
                                    ]}
                                >
                                    <Pressable
                                        style={[
                                            styles.checkbox,
                                            { borderColor: theme.textSecondary },
                                            item.completed && { backgroundColor: theme.accent, borderColor: theme.accent }
                                        ]}
                                        onPress={() => handleToggleGoal(item.id)}
                                        android_ripple={{ color: theme.accentLight, radius: 20 }}
                                    >
                                        {item.completed && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </Pressable>
                                    <Text
                                        style={[
                                            styles.goalText,
                                            { color: theme.text },
                                            item.completed && {
                                                textDecorationLine: 'line-through',
                                                color: theme.textSecondary
                                            }
                                        ]}
                                    >
                                        {item.text}
                                    </Text>
                                </Animated.View>
                            </Swipeable>
                        )}
                        style={{ width: '100%' }}
                        contentContainerStyle={{ paddingVertical: spacing.xs }}
                    />
                )}
            </View>

            {isAdding ? (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.card,
                                color: theme.text,
                                borderColor: theme.divider
                            }
                        ]}
                        value={input}
                        onChangeText={setInput}
                        placeholder="What do you want to accomplish?"
                        placeholderTextColor={theme.textSecondary}
                        autoFocus
                        maxLength={50}
                    />
                    <View style={styles.inputButtons}>
                        <MotivoButton
                            title="Cancel"
                            onPress={() => {
                                setInput('');
                                setIsAdding(false);
                            }}
                            variant="outline"
                            style={{ flex: 1, marginRight: spacing.md }}
                        />
                        <MotivoButton
                            title="Add"
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
                    style={styles.addButton}
                    variant={goals.length >= MAX_GOALS ? "outline" : "primary"}
                    disabled={goals.length >= MAX_GOALS}
                />
            )}

            <View style={styles.progressContainer}>
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                    {goals.filter(g => g.completed).length} of {goals.length} completed
                </Text>
                <View style={[styles.progressBar, { backgroundColor: theme.backgroundAlt }]}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            {
                                backgroundColor: theme.accent,
                                width: `${goals.length > 0 ? (goals.filter(g => g.completed).length / goals.length) * 100 : 0}%`
                            }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl, // More generous padding
    },
    headerSection: {
        marginBottom: spacing.xl, // More space below header
    },
    title: {
        ...typography.title,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.bodySmall,
    },
    goalsContainer: {
        borderRadius: roundness.md, // More subtle rounding
        overflow: 'hidden',
        marginBottom: spacing.xl, // More space below container
        flex: 1,
        borderWidth: 1, // Subtle border
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        textAlign: 'center',
    },
    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg, // More space in rows
        borderBottomWidth: 1,
    },
    checkbox: {
        width: 20, // Slightly smaller checkbox
        height: 20, // Slightly smaller checkbox
        borderRadius: roundness.sm,
        borderWidth: 1, // Thinner border
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14, // Slightly smaller checkmark
        fontWeight: 'bold',
    },
    goalText: {
        ...typography.body,
        flex: 1,
    },
    inputContainer: {
        marginBottom: spacing.xl, // More space below input
    },
    input: {
        borderRadius: roundness.sm, // More subtle rounding
        padding: spacing.md,
        marginBottom: spacing.md, // More space below input
        borderWidth: 1,
        ...typography.body,
    },
    inputButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addButton: {
        marginBottom: spacing.xl, // More space below button
    },
    progressContainer: {
        marginBottom: spacing.xl,
    },
    progressText: {
        ...typography.bodySmall,
        textAlign: 'center',
        marginBottom: spacing.md, // More space below text
    },
    progressBar: {
        height: 4, // Thinner progress bar for minimalism
        borderRadius: roundness.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: roundness.full,
    },
    deleteAction: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginVertical: 1,
        padding: spacing.md,
        width: 100,
    },
    deleteActionText: {
        color: 'white',
        ...typography.bodySmall,
        fontWeight: '500', // Less bold for minimalism
    }
});

export default GoalsScreen;