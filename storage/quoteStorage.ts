// storage/quoteStorage.ts

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Quote } from '../types';

const QUOTES_FILE = require('../data/quotes.json');

export async function loadQuotes(): Promise<Quote[]> {
    // quotes.json is bundled, so it's safe to import directly
    return QUOTES_FILE as Quote[];
}

export function getRandomQuote(quotes: Quote[]): Quote {
    const i = Math.floor(Math.random() * quotes.length);
    return quotes[i];
}