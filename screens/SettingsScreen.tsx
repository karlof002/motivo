// screens/SettingsScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotivoButton } from '../components/MotivoButton';
import { useColorScheme } from 'react-native';

type ThemeColor = 'light' | 'ocean' | 'forest';
type Language = 'en' | 'de';

const THEME_COLORS: { key: ThemeColor; label: string; color: string }[] = [
    { key: 'light', label: 'Light', color: '#F7EFE5' },
    { key: 'ocean', label: 'Ocean', color: '#A7C7E7' },
    { key: 'forest', label: 'Forest', color: '#B5D6A7' },
];

const LANGUAGES: { key: Language; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'de', label: 'Deutsch' },
];

const THEME_KEY = '@motivo_theme_color';
const LANG_KEY = '@motivo_language';

const SettingsScreen: React.FC = () => {
    const [theme, setTheme] = useState<ThemeColor>('light');
    const [language, setLanguage] = useState<Language>('en');
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const [storedTheme, storedLang] = await Promise.all([
                AsyncStorage.getItem(THEME_KEY),
                AsyncStorage.getItem(LANG_KEY),
            ]);
            if (storedTheme) setTheme(storedTheme as ThemeColor);
            if (storedLang) setLanguage(storedLang as Language);
        } catch {
            // ignore
        }
    }

    async function handleThemeChange(key: ThemeColor) {
        setTheme(key);
        await AsyncStorage.setItem(THEME_KEY, key);
        Alert.alert('Theme updated!', `Theme set to ${THEME_COLORS.find(t => t.key === key)?.label}`);
    }

    async function handleLanguageChange(key: Language) {
        setLanguage(key);
        await AsyncStorage.setItem(LANG_KEY, key);
        Alert.alert('Language updated!', `Language set to ${LANGUAGES.find(l => l.key === key)?.label}`);
    }

    // Dark mode toggle is shown, but system theme is used for now
    // To fully control, you need ThemeContext/provider (expand as needed)
    return (
        <View style={[styles.container, isDark && styles.darkBg]}>
            <Text style={[styles.title, isDark && styles.darkText]}>Settings</Text>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Theme Color</Text>
                <View style={styles.row}>
                    {THEME_COLORS.map(option => (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.colorCircle,
                                { backgroundColor: option.color, borderWidth: theme === option.key ? 3 : 1, borderColor: theme === option.key ? '#FFD580' : '#ccc' },
                                isDark && styles.darkCircle,
                            ]}
                            onPress={() => handleThemeChange(option.key)}
                        >
                            {theme === option.key && <Text style={styles.checkMark}>✔</Text>}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Language</Text>
                <View style={styles.row}>
                    {LANGUAGES.map(option => (
                        <MotivoButton
                            key={option.key}
                            title={option.label}
                            onPress={() => handleLanguageChange(option.key)}
                            style={
                                language === option.key
                                    ? { ...styles.langButton, ...styles.selectedLangBtn }
                                    : styles.langButton
                            }
                            textStyle={language === option.key ? styles.selectedLangText : undefined}
                            disabled={language === option.key}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Dark Mode</Text>
                <View style={styles.row}>
                    <Text style={[styles.darkModeLabel, isDark && styles.darkText]}>
                        Uses your system setting ({isDark ? 'Dark' : 'Light'})
                    </Text>
                    <Switch value={isDark} disabled />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7EFE5',
        padding: 24,
    },
    darkBg: { backgroundColor: '#22223B' },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
        color: '#22223B',
        letterSpacing: 0.3,
    },
    darkText: { color: '#F7EFE5' },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#22223B',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginRight: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkCircle: {
        borderColor: '#555',
    },
    checkMark: {
        fontSize: 18,
        color: '#A77C1F',
        fontWeight: 'bold',
    },
    langButton: {
        marginRight: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#FFFDF6',
    },
    selectedLangBtn: {
        backgroundColor: '#FFD580',
    },
    selectedLangText: {
        color: '#22223B',
        fontWeight: '700',
    },
    darkModeLabel: {
        fontSize: 15,
        marginRight: 12,
        color: '#22223B',
    },
});

export default SettingsScreen;