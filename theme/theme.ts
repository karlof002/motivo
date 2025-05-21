// theme/theme.ts

import { ColorSchemeName, TextStyle } from 'react-native';

export type ThemeColorScheme = 'light' | 'ocean' | 'forest' | 'minimal';

// 2025 modern design - refined color palette with enhanced contrast and vibrancy
export const themeColors = {
    light: {
        background: '#F8F6F2',        // Slightly warmer background
        backgroundAlt: '#FDFAF4',     // Subtle alt background
        card: '#FFFFFF',              // Pure white cards for clarity
        cardElevated: '#FFFFFF',
        text: '#1A1A2E',              // Deeper text for better readability
        textSecondary: '#555566',
        accent: '#FF9F5B',            // More vibrant orange accent
        accentDark: '#E5823C',
        accentLight: '#FFF2E9',
        secondary: '#A06A1F',
        divider: 'rgba(34,34,59,0.06)',
        shadow: 'rgba(0,0,0,0.08)',
        success: '#66BB6A',           // More vibrant success
        error: '#F44336',             // More vibrant error
        warning: '#FFA726',
        skeleton: '#F0F0F0',
    },
    ocean: {
        background: '#F0F7FC',        // Lighter, airier background
        backgroundAlt: '#E8F4FA',
        card: '#FFFFFF',              // White cards for clarity
        cardElevated: '#FFFFFF',
        text: '#0A2540',              // Deeper navy text
        textSecondary: '#3A5A72',
        accent: '#4EA2DD',            // Brighter blue
        accentDark: '#2D88C3',
        accentLight: '#E5F4FC',
        secondary: '#23608A',
        divider: 'rgba(17,50,77,0.06)',
        shadow: 'rgba(17,50,77,0.08)',
        success: '#4CAF50',
        error: '#EF5350',
        warning: '#FFA726',
        skeleton: '#E5EFF7',
    },
    forest: {
        background: '#F4F9F1',       // Lighter, fresher background
        backgroundAlt: '#ECF5E8',
        card: '#FFFFFF',             // White cards
        cardElevated: '#FFFFFF',
        text: '#1E401B',             // Deeper forest green
        textSecondary: '#436B3C',
        accent: '#7AC064',           // Brighter green
        accentDark: '#5EA646',
        accentLight: '#EDF7E9',
        secondary: '#3A5F1C',
        divider: 'rgba(35,76,29,0.06)',
        shadow: 'rgba(35,76,29,0.08)',
        success: '#689F38',
        error: '#EF5350',
        warning: '#FFB74D',
        skeleton: '#EDF5EA',
    },
    minimal: {
        background: '#FFFFFF',       // Pure white background for minimalism
        backgroundAlt: '#F9F9F9',    // Very subtle contrast for alt backgrounds
        card: '#FFFFFF',             // Same as background for minimal distinction
        cardElevated: '#FFFFFF',     // Still white, elevation comes from subtle shadows
        text: '#333333',             // Not too dark, softer on the eyes
        textSecondary: '#767676',    // Subtle gray for secondary text
        accent: '#B3B3B3',           // Monochrome gray accent 
        accentDark: '#8A8A8A',       // Darker gray for interactions
        accentLight: '#F2F2F2',      // Very light gray background accents
        secondary: '#555555',        // Slightly darker gray for contrast
        divider: 'rgba(0,0,0,0.04)', // Very subtle dividers
        shadow: 'rgba(0,0,0,0.05)',  // Very subtle shadows
        success: '#9ED8A0',          // Muted pastel success
        error: '#E6A2A2',            // Muted pastel error
        warning: '#E6D0A2',          // Muted pastel warning
        skeleton: '#F5F5F5',         // Very subtle skeleton
    },
    dark: {
        background: '#121420',       // Deeper, richer dark background
        backgroundAlt: '#1B1E2B',
        card: '#282A3A',             // More distinguished card background
        cardElevated: '#32344A',
        text: '#F8F9FA',             // Crisper white text
        textSecondary: '#D8DCE6',
        accent: '#5BB2FF',           // Brighter blue accent
        accentDark: '#3D98E6',
        accentLight: '#273645',
        secondary: '#A8CCEF',
        divider: 'rgba(248,249,250,0.07)',
        shadow: 'rgba(0,0,0,0.25)',
        success: '#81C784',
        error: '#F48FB1',
        warning: '#FFD54F',
        skeleton: '#32344A',
    }
};

// Minimalist spacing - more generous, consistent spacing
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,      // More consistent spacing
    xl: 32,      // More generous spacing for minimalism
    xxl: 48      // Back to original
};

// Minimalist roundness - more subtle curves
export const roundness = {
    sm: 4,       // Reduced from 8 - more subtle
    md: 8,       // Reduced from 12 - more subtle
    lg: 12,      // Reduced from 16 - more subtle
    xl: 16,      // Reduced from 24 - more subtle
    full: 9999
};

// Modern minimalist typography - simpler system
export const typography = {
    display: {
        fontSize: 32,        // Slightly smaller
        fontWeight: '500' as TextStyle['fontWeight'], // Less heavy
        letterSpacing: -0.5, // Slightly condensed
    },
    title: {
        fontSize: 22,        // Slightly smaller
        fontWeight: '500' as TextStyle['fontWeight'], // Less heavy
        letterSpacing: -0.2,
    },
    subtitle: {
        fontSize: 17,        // Slightly smaller
        fontWeight: '500' as TextStyle['fontWeight'], // Less heavy
        letterSpacing: 0,
    },
    body: {
        fontSize: 15,        // Slightly smaller
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.1,  // Slightly more spaced
    },
    bodySmall: {
        fontSize: 13,        // Slightly smaller
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.1,  // Slightly more spaced
    },
    caption: {
        fontSize: 11,        // Slightly smaller
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.3,  // More spaced for legibility
    },
    button: {
        fontSize: 14,        // Slightly smaller
        fontWeight: '600' as TextStyle['fontWeight'], // Less heavy
        letterSpacing: 0.3,  // More spaced
    }
};

// Minimalist elevation - much more subtle shadows
export const elevation = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,  // More subtle
        shadowRadius: 4,      // Smaller radius
        elevation: 1,         // Lower elevation
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,  // More subtle
        shadowRadius: 6,      // Smaller radius
        elevation: 2,         // Lower elevation
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,  // More subtle
        shadowRadius: 8,      // Smaller radius
        elevation: 3,         // Lower elevation
    }
};

export type Theme = typeof themeColors.light;

export function getTheme(
    colorScheme: ColorSchemeName,
    themeColor: ThemeColorScheme = 'minimal'
): Theme {
    if (colorScheme === 'dark') return themeColors.dark;
    return themeColors[themeColor];
}