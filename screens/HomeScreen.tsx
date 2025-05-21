// screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MotivoButton } from '../components/MotivoButton';
import { loadQuotes, getRandomQuote } from '../storage/quoteStorage';
import { Quote } from '../types';
import { useColorScheme } from 'react-native';

const HomeScreen: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    useEffect(() => {
        (async () => {
            const loadedQuotes = await loadQuotes();
            setQuotes(loadedQuotes);
            setCurrentQuote(getRandomQuote(loadedQuotes));
            setLoading(false);
        })();
    }, []);

    const handleNewQuote = () => {
        if (quotes.length === 0) return;
        let nextQuote: Quote;
        do {
            nextQuote = getRandomQuote(quotes);
        } while (nextQuote.id === currentQuote?.id && quotes.length > 1);
        setCurrentQuote(nextQuote);
    };

    const handleSaveQuote = () => {
        // TODO: Implement saving to favorites with AsyncStorage
        Alert.alert('Coming soon!', 'Save to favorites is not implemented yet.');
    };

    if (loading || !currentQuote) {
        return (
            <View style={[styles.container, isDark && styles.darkBg]}>
                <ActivityIndicator size="large" color="#ccc" />
            </View>
        );
    }

    return (
        <View style={[styles.container, isDark && styles.darkBg]}>
            <View style={[styles.quoteCard, isDark && styles.darkCard]}>
                <Text style={[styles.quoteText, isDark && styles.darkText]}>
                    "{currentQuote.text}"
                </Text>
                {currentQuote.author && (
                    <Text style={[styles.author, isDark && styles.darkText]}>
                        — {currentQuote.author}
                    </Text>
                )}
            </View>
            <MotivoButton title="New Quote" onPress={handleNewQuote} />
            <MotivoButton title="Save Quote" onPress={handleSaveQuote} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7EFE5',
        padding: 24,
    },
    darkBg: {
        backgroundColor: '#22223B',
    },
    quoteCard: {
        backgroundColor: '#FFFDF6',
        borderRadius: 24,
        padding: 28,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        alignItems: 'center',
        marginBottom: 32,
        minWidth: 280,
        maxWidth: 380,
    },
    darkCard: {
        backgroundColor: '#363654',
    },
    quoteText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#22223B',
        textAlign: 'center',
        marginBottom: 14,
        fontFamily: 'Inter', // If you load custom fonts
    },
    darkText: {
        color: '#F7EFE5',
    },
    author: {
        fontSize: 16,
        fontWeight: '400',
        color: '#555',
        textAlign: 'right',
        marginTop: 4,
        fontStyle: 'italic',
    },
});

export default HomeScreen;