import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ColorValue } from 'react-native';
import { useColorScheme } from 'react-native';

type MotivoButtonProps = {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    color?: ColorValue; // Override button color
    disabled?: boolean;
};

const LIGHT_BG = '#F7EFE5';
const DARK_BG = '#22223B';
const LIGHT_TEXT = '#22223B';
const DARK_TEXT = '#F7EFE5';

export const MotivoButton: React.FC<MotivoButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    color,
    disabled = false,
}) => {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.button,
                { backgroundColor: color || (isDark ? DARK_BG : LIGHT_BG), opacity: disabled ? 0.5 : 1 },
                style,
            ]}
            disabled={disabled}
            android_ripple={{ color: '#cccccc' }}
        >
            <Text
                style={[
                    styles.text,
                    { color: isDark ? DARK_TEXT : LIGHT_TEXT },
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});