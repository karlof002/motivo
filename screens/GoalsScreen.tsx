// screens/GoalsScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { Goal } from '../types';
import { useColorScheme } from 'react-native';

const STORAGE_KEY = '@weekly_goals';
const MAX_GOALS = 3;

const GoalsScreen: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [input, setInput] = useState('');
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    useEffect(() => {
        loadGoals();
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
        saveGoals([...goals, newGoal]);
        setInput('');
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

    return (
        <View style={[styles.container, isDark && styles.darkBg]}>
            <Text style={[styles.title, isDark && styles.darkText]}>Weekly Goals</Text>
            <Text style={[styles.subtitle, isDark && styles.darkText]}>
                Set up to 3 goals to focus on!
            </Text>
            <FlatList
                data={goals}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.goalRow, isDark && styles.darkGoalRow]}>
                        <TouchableOpacity
                            style={[
                                styles.checkbox,
                                item.completed && styles.checked,
                                isDark && styles.darkCheckbox,
                                item.completed && isDark && styles.darkChecked,
                            ]}
                            onPress={() => handleToggleGoal(item.id)}
                        >
                            {item.completed && (
                                <Text style={[styles.checkmark, isDark && styles.darkCheckmark]}>✔</Text>
                            )}
                        </TouchableOpacity>
                        <Text
                            style={[
                                styles.goalText,
                                item.completed && styles.completedText,
                                isDark && styles.darkText,
                                item.completed && isDark && styles.darkCompletedText,
                            ]}
                        >
                            {item.text}
                        </Text>
                        <TouchableOpacity onPress={() => handleDeleteGoal(item.id)}>
                            <Text style={[styles.delete, isDark && styles.darkDelete]}>✕</Text>
                        </TouchableOpacity>
                    </View>
                )}
                style={{ width: '100%', marginBottom: 20 }}
                ListEmptyComponent={
                    <Text style={[styles.empty, isDark && styles.darkText]}>
                        No goals yet. Add one below!
                    </Text>
                }
            />
            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, isDark && styles.darkInput]}
                    value={input}
                    onChangeText={setInput}
                    placeholder="New goal..."
                    placeholderTextColor={isDark ? '#aaa' : '#888'}
                    maxLength={40}
                />
                <MotivoButton title="Add" onPress={handleAddGoal} style={{ flex: 1, marginLeft: 8 }} />
            </View>
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
        marginBottom: 4,
        color: '#22223B',
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        marginBottom: 18,
    },
    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFDF6',
        borderRadius: 18,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
    },
    darkGoalRow: { backgroundColor: '#363654' },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#b3b3b3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        backgroundColor: '#faf8f2',
    },
    checked: {
        backgroundColor: '#C5E1A5',
        borderColor: '#7CB342',
    },
    darkCheckbox: {
        borderColor: '#444466',
        backgroundColor: '#2f2f48',
    },
    darkChecked: {
        backgroundColor: '#446644',
        borderColor: '#A5D6A7',
    },
    checkmark: {
        color: '#5A5',
        fontSize: 18,
        fontWeight: 'bold',
    },
    darkCheckmark: { color: '#D0FFD0' },
    goalText: {
        flex: 1,
        fontSize: 17,
        color: '#22223B',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#bbb',
    },
    darkCompletedText: {
        color: '#666',
    },
    delete: {
        marginLeft: 12,
        fontSize: 18,
        color: '#E57373',
    },
    darkDelete: { color: '#FFB4B4' },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 8,
    },
    input: {
        flex: 2,
        backgroundColor: '#FFFDF6',
        borderRadius: 10,
        fontSize: 16,
        color: '#22223B',
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
    darkInput: {
        backgroundColor: '#363654',
        color: '#F7EFE5',
    },
    empty: {
        textAlign: 'center',
        marginVertical: 24,
        color: '#888',
        fontSize: 15,
    },
    darkText: {
        color: '#F7EFE5',
    },
});

export default GoalsScreen;