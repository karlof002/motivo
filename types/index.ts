// types/index.ts

export type Quote = {
    id: string;
    text: string;
    author?: string;
};

export type JournalEntry = {
    date: string; // YYYY-MM-DD
    text: string;
};

export type Goal = {
    id: string;
    text: string;
    completed: boolean;
};

export type Mood =
    | 'happy'
    | 'neutral'
    | 'sad'
    | 'angry'
    | 'tired';

export type MoodEntry = {
    date: string; // YYYY-MM-DD
    mood: Mood;
};