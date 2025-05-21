// theme/theme.ts

import { ColorSchemeName } from 'react-native';

export type ThemeColorScheme = 'light' | 'ocean' | 'forest';

export const themeColors = {
    light: {
        background: '#F7EFE5',
        card: '#FFFDF6',
        text: '#22223B',
        accent: '#FFD580',
        secondary: '#A77C1F',
        shadow: 'rgba(0,0,0,0.08)',
    },
    ocean: {
        background: '#A7C7E7',
        card: '#DCEAF6',
        text: '#11324D',
        accent: '#55A0D3',
        secondary: '#23608A',
        shadow: 'rgba(17,50,77,0.08)',
    },
    forest: {
        background: '#B5D6A7',
        card: '#E7F6DC',
        text: '#234C1D',
        accent: '#88C36D',
        secondary: '#426B1F',
        shadow: 'rgba(35,76,29,0.08)',
    },
    dark: {
        background: '#22223B',
        card: '#363654',
        text: '#F7EFE5',
        accent: '#FFD580',
        secondary: '#A77C1F',
        shadow: 'rgba(0,0,0,0.14)',
    },
};

export type Theme = typeof themeColors.light;

export function getTheme(
    colorScheme: ColorSchemeName,
    themeColor: ThemeColorScheme = 'light'
): Theme {
    if (colorScheme === 'dark') return themeColors.dark;
    return themeColors[themeColor];
}