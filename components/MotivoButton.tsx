import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ColorValue,
    View,
    ActivityIndicator,
    Animated
} from 'react-native';
import { useColorScheme } from 'react-native';
import { getTheme, spacing, roundness, typography, elevation } from '@theme/theme';
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
    iconPosition?: 'left' | 'right';
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
    iconPosition = 'left',
}) => {
    const scheme = useColorScheme();
    const theme = getTheme(scheme);
    // Animation value for press feedback
    const [scaleAnim] = React.useState(new Animated.Value(1));

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
                return '#22223B'; // dark text on light accent
            case 'secondary':
                return '#22223B'; // dark text on accentLight
            case 'outline':
            case 'ghost':
                return color || theme.accent || '#22223B';
            default:
                return '#22223B';
        }
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: spacing.xs + 2,
                    paddingHorizontal: spacing.md,
                    borderRadius: roundness.md,
                };
            case 'medium':
                return {
                    paddingVertical: spacing.sm + 2,
                    paddingHorizontal: spacing.md + 4,
                    borderRadius: roundness.md,
                };
            case 'large':
                return {
                    paddingVertical: spacing.md - 2,
                    paddingHorizontal: spacing.lg,
                    borderRadius: roundness.md,
                };
        }
    };

    const getTextSize = (): TextStyle => {
        switch (size) {
            case 'small':
                return { fontSize: 13 };
            case 'medium':
                return { fontSize: 15 };
            case 'large':
                return { fontSize: 16 };
        }
    };

    // Handle press animation
    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            speed: 40,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            speed: 30,
            useNativeDriver: true,
        }).start();
    };

    // Modern animated button with subtle scaling effect
    return (
        <Animated.View
            style={[
                fullWidth && styles.fullWidth,
                { transform: [{ scale: scaleAnim }] },
            ]}
        >
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={({ pressed }) => [
                    styles.button,
                    getButtonStyle(),
                    getSizeStyle(),
                    { opacity: (pressed || disabled) ? 0.9 : 1 },
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
                            {icon && iconPosition === 'left' && (
                                <View style={styles.iconContainer}>{icon}</View>
                            )}
                            <Text
                                style={[
                                    styles.text,
                                    getTextSize(),
                                    typography.button,
                                    { color: getTextColor() },
                                    textStyle,
                                ]}
                            >
                                {title}
                            </Text>
                            {icon && iconPosition === 'right' && (
                                <View style={[styles.iconContainer, styles.iconRight]}>{icon}</View>
                            )}
                        </>
                    )}
                </View>
            </Pressable>
        </Animated.View>
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
        ...typography.button,
        textAlign: 'center',
    },
    iconContainer: {
        marginRight: spacing.sm,
    },
    iconRight: {
        marginRight: 0,
        marginLeft: spacing.sm,
    },
    loader: {
        marginHorizontal: spacing.xs,
    },
});