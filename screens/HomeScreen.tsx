// screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Animated,
    TouchableOpacity,
    Image,
    useColorScheme
} from 'react-native';
import { MotivoButton } from '../components/MotivoButton';
import { loadQuotes, getRandomQuote } from '../storage/quoteStorage';
import { Quote } from '../types';
import { getTheme, spacing, roundness, typography, elevation } from '../theme/theme';

const HomeScreen: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const [fadeAnim] = useState(new Animated.Value(0));
    const colorScheme = useColorScheme();
    const theme = getTheme(colorScheme);

    useEffect(() => {
        loadQuotesData();
    }, []);

    useEffect(() => {
        // Modern 2025 animation - smooth transitions between quotes
        if (currentQuote) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [currentQuote]);

    const loadQuotesData = async () => {
        const loadedQuotes = await loadQuotes();
        setQuotes(loadedQuotes);
        setCurrentQuote(getRandomQuote(loadedQuotes));
        setLoading(false);

        // Fade in animation when loaded
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    const handleNewQuote = () => {
        if (quotes.length === 0) return;
        let nextQuote: Quote;
        do {
            nextQuote = getRandomQuote(quotes);
        } while (nextQuote.id === currentQuote?.id && quotes.length > 1);

        // Fade out/in animation for quote change
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setCurrentQuote(nextQuote);
        });
    };

    const handleSaveQuote = () => {
        // TODO: Implement saving to favorites with AsyncStorage
        Alert.alert('Coming soon!', 'Save to favorites is not implemented yet.');
    };

    if (loading || !currentQuote) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.accent} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Top decoration */}
            <View style={[styles.decorationTop, { backgroundColor: theme.accentLight }]} />

            <Animated.View
                style={[
                    styles.quoteCard,
                    {
                        backgroundColor: theme.card,
                        shadowColor: theme.shadow,
                        transform: [{
                            scale: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.95, 1]
                            })
                        }],
                        opacity: fadeAnim
                    },
                    elevation.medium
                ]}
            >
                <View style={styles.quoteMarkContainer}>
                    <Text style={[styles.quoteMark, { color: theme.accent }]}>❝</Text>
                </View>
                <Text style={[styles.quoteText, { color: theme.text }]}>
                    {currentQuote.text}
                </Text>
                {currentQuote.author && (
                    <Text style={[styles.author, { color: theme.textSecondary }]}>
                        — {currentQuote.author}
                    </Text>
                )}
            </Animated.View>

            <View style={styles.buttonContainer}>
                <MotivoButton
                    title="New Quote"
                    onPress={handleNewQuote}
                    variant="primary"
                    style={styles.primaryButton}
                />
                <MotivoButton
                    title="Save Quote"
                    onPress={handleSaveQuote}
                    variant="outline"
                    style={styles.secondaryButton}
                />
            </View>

            {/* Bottom decoration */}
            <View style={[styles.decorationBottom, { backgroundColor: theme.accentLight }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
        position: 'relative',
        overflow: 'hidden',
    },
    decorationTop: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.5,
    },
    decorationBottom: {
        position: 'absolute',
        bottom: -80,
        left: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.5,
    },
    quoteCard: {
        borderRadius: roundness.lg,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.xl,
        minWidth: 300,
        maxWidth: 400,
        width: '100%',
        position: 'relative',
        paddingTop: spacing.xl + 10,
    },
    quoteMarkContainer: {
        position: 'absolute',
        top: -15,
        left: 20,
    },
    quoteMark: {
        fontSize: 60,
        opacity: 0.7,
    },
    quoteText: {
        ...typography.subtitle,
        textAlign: 'center',
        marginBottom: spacing.md,
        lineHeight: 26,
    },
    author: {
        ...typography.bodySmall,
        textAlign: 'right',
        alignSelf: 'flex-end',
        marginTop: spacing.sm,
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: spacing.md,
    },
    primaryButton: {
        flex: 1,
        marginRight: spacing.sm,
    },
    secondaryButton: {
        flex: 1,
        marginLeft: spacing.sm,
    },
})

export default HomeScreen;