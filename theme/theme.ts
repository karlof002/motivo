// theme/theme.ts

import { ColorSchemeName, TextStyle } from 'react-native';

export type ThemeColorScheme = 'light' | 'ocean' | 'forest';

// 2025 design - richer color palette with accent variations, enhanced contrast
export const themeColors = {
    light: {
        background: '#F7EFE5',
        backgroundAlt: '#FDFAF2',
        card: '#FFFDF6',
        cardElevated: '#FFFFFF',
        text: '#22223B',
        textSecondary: '#555566',
        accent: '#FFD580',
        accentDark: '#E5B35C',
        accentLight: '#FFF0D6',
        secondary: '#A77C1F',
        divider: 'rgba(34,34,59,0.08)',
        shadow: 'rgba(0,0,0,0.12)',
        success: '#7CB342',
        error: '#E57373',
        warning: '#FFB74D',
        skeleton: '#E8E8E8',
    },
    ocean: {
        background: '#EBF5FC',
        backgroundAlt: '#E0F0FA',
        card: '#DCEAF6',
        cardElevated: '#FFFFFF',
        text: '#11324D',
        textSecondary: '#3A5A72',
        accent: '#55A0D3',
        accentDark: '#3A89C0',
        accentLight: '#D0E8F5',
        secondary: '#23608A',
        divider: 'rgba(17,50,77,0.08)',
        shadow: 'rgba(17,50,77,0.12)',
        success: '#4CAF50',
        error: '#EF5350',
        warning: '#FFA726',
        skeleton: '#D0E0ED',
    },
    forest: {
        background: '#EEF7EA',
        backgroundAlt: '#E3F2DD',
        card: '#E7F6DC',
        cardElevated: '#FFFFFF',
        text: '#234C1D',
        textSecondary: '#436B3C',
        accent: '#88C36D',
        accentDark: '#6AAC4B',
        accentLight: '#D8ECCD',
        secondary: '#426B1F',
        divider: 'rgba(35,76,29,0.08)',
        shadow: 'rgba(35,76,29,0.12)',
        success: '#689F38',
        error: '#EF5350',
        warning: '#FFB74D',
        skeleton: '#D8E6D2',
    },
    dark: {
        background: '#1D1D31',
        backgroundAlt: '#22223B',
        card: '#2E2E4A',
        cardElevated: '#363654',
        text: '#F7EFE5',
        textSecondary: '#CCCCDD',
        accent: '#66B6FF',
        accentDark: '#3D98E6',
        accentLight: '#2C3A4B',
        secondary: '#A8CCEF',
        divider: 'rgba(247,239,229,0.08)',
        shadow: 'rgba(0,0,0,0.2)',
        success: '#81C784',
        error: '#EF9A9A',
        warning: '#FFD54F',
        skeleton: '#363654',
    }
};

// 2025 Design System - standardized styling
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
};

export const roundness = {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999
};

export const typography = {
    display: {
        fontSize: 32,
        fontWeight: '700' as TextStyle['fontWeight'],
        letterSpacing: 0.2,
    },
    title: {
        fontSize: 24,
        fontWeight: '700' as TextStyle['fontWeight'],
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600' as TextStyle['fontWeight'],
        letterSpacing: 0.15,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.15,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.1,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as TextStyle['fontWeight'],
        letterSpacing: 0.4,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as TextStyle['fontWeight'],
        letterSpacing: 0.3,
    }
};

export const elevation = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    }
};

export type Theme = typeof themeColors.light;

export function getTheme(
    colorScheme: ColorSchemeName,
    themeColor: ThemeColorScheme = 'light'
): Theme {
    if (colorScheme === 'dark') return themeColors.dark;
    return themeColors[themeColor];
}