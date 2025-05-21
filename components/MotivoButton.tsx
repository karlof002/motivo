import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ColorValue,
    View,
    ActivityIndicator
} from 'react-native';
import { useColorScheme } from 'react-native';
import { getTheme, spacing, roundness, typography, elevation } from '../theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

type MotivoButtonProps = {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    color?: ColorValue; // Override button color
    disabled?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
};

export const MotivoButton: React.FC<MotivoButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    color,
    disabled = false,
    variant = 'primary',
    size = 'medium',
    loading = false,
    icon,
    fullWidth = false,
}) => {
    const scheme = useColorScheme();
    const theme = getTheme(scheme);

    // Modern style handling based on variants
    const getButtonStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: color || theme.accent,
                    borderWidth: 0,
                };
            case 'secondary':
                return {
                    backgroundColor: theme.accentLight,
                    borderWidth: 0,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: color || theme.accent,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    ...elevation.small,
                    shadowOpacity: 0,
                    elevation: 0,
                };
        }
    };

    const getTextColor = (): ColorValue => {
        switch (variant) {
            case 'primary':
                return theme.background;
            case 'secondary':
                return theme.text;
            case 'outline':
            case 'ghost':
                return color || theme.accent;
        }
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderRadius: roundness.md,
                };
            case 'medium':
                return {
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.lg,
                    borderRadius: roundness.md,
                };
            case 'large':
                return {
                    paddingVertical: spacing.lg - 4,
                    paddingHorizontal: spacing.xl,
                    borderRadius: roundness.lg,
                };
        }
    };

    const getTextSize = (): TextStyle => {
        switch (size) {
            case 'small':
                return { fontSize: 14 };
            case 'medium':
                return { fontSize: 16 };
            case 'large':
                return { fontSize: 18 };
        }
    };

    // 2025 design - better visual feedback with ripple and transitions
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                getButtonStyle(),
                getSizeStyle(),
                fullWidth && styles.fullWidth,
                { opacity: (pressed || disabled) ? 0.8 : 1 },
                disabled && styles.disabled,
                style,
            ]}
            disabled={disabled || loading}
            android_ripple={{
                color: variant === 'primary' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                borderless: false,
                foreground: true
            }}
        >
            <View style={styles.contentContainer}>
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={getTextColor() as string}
                        style={styles.loader}
                    />
                ) : (
                    <>
                        {icon && <View style={styles.iconContainer}>{icon}</View>}
                        <Text
                            style={[
                                styles.text,
                                typography.button,
                                getTextSize(),
                                { color: getTextColor() },
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    </>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.sm,
        ...elevation.small,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    iconContainer: {
        marginRight: spacing.sm,
    },
    loader: {
        marginHorizontal: spacing.xs,
    },
});