// screens/HomeScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Alert,
    Animated,
    TouchableOpacity,
    useColorScheme,
    Dimensions,
    Pressable
} from 'react-native';
import { MotivoButton } from '../components/MotivoButton';
import { loadQuotes, getRandomQuote } from '../storage/quoteStorage';
import { Quote } from '../types';
import { getTheme } from '@theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    const colorScheme = useColorScheme();
    const theme = getTheme(colorScheme, 'minimal'); // Default theme

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const moveAnim = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        loadQuotesData();
    }, []);

    useEffect(() => {
        // Animate new quotes into view
        if (currentQuote) {
            moveAnim.setValue(10);
            fadeAnim.setValue(0);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(moveAnim, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [currentQuote]);

    const loadQuotesData = async () => {
        try {
            const loadedQuotes = await loadQuotes();
            setQuotes(loadedQuotes);
            setCurrentQuote(getRandomQuote(loadedQuotes));
        } catch (error) {
            console.error('Failed to load quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewQuote = () => {
        if (quotes.length === 0) return;

        let nextQuote: Quote;
        do {
            nextQuote = getRandomQuote(quotes);
        } while (nextQuote.id === currentQuote?.id && quotes.length > 1);

        // Fade out current quote
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(moveAnim, {
                toValue: -10,
                duration: 400,
                useNativeDriver: true
            })
        ]).start(() => {
            setCurrentQuote(nextQuote);
            setIsFavorite(false); // Reset favorite state for new quote
        });
    };

    const handleSaveQuote = () => {
        // Toggle favorite status
        setIsFavorite(!isFavorite);

        // TODO: Implement actual saving to favorites with AsyncStorage
        Alert.alert(
            isFavorite ? 'Removed from favorites' : 'Saved to favorites',
            isFavorite ? 'Quote removed from your collection.' : 'Quote added to your collection.'
        );
    };

    // Loading state with branded appearance
    if (loading || !currentQuote) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                <ActivityIndicator size="large" color={theme.accent} />
                <Text className="text-neutral-500 dark:text-neutral-400 mt-4 font-medium">
                    Loading inspiration...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            {/* Main content */}
            <View className="flex-1 items-center justify-center px-6">
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: moveAnim }],
                        width: '100%',
                    }}
                >
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md mx-auto max-w-md border border-neutral-100 dark:border-neutral-700">
                        <Text className="text-2xl text-neutral-600 dark:text-neutral-300 text-center font-medium mb-1">
                            {'"'}
                        </Text>

                        <Text className="text-lg text-neutral-800 dark:text-neutral-200 text-center mb-4 leading-7 font-normal">
                            {currentQuote.text}
                        </Text>

                        {currentQuote.author && (
                            <Text className="text-right text-neutral-500 dark:text-neutral-400 italic mt-4">
                                — {currentQuote.author}
                            </Text>
                        )}

                        {/* Quick action buttons */}
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 items-center justify-center mr-2"
                                onPress={() => Alert.alert('Share', 'Share feature coming soon!')}
                            >
                                <Ionicons name="share-social-outline" size={18} color={theme.accent} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 items-center justify-center"
                                onPress={handleSaveQuote}
                            >
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={18}
                                    color={isFavorite ? "#ef4444" : theme.accent}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Action button */}
                <View className="w-full mt-8 px-6 mb-6">
                    <Pressable
                        className="w-full bg-orange-500 h-14 rounded-xl items-center justify-center shadow-sm"
                        onPress={handleNewQuote}
                        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
                    >
                        <Text className="text-white font-medium text-base">
                            New Inspiration
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;