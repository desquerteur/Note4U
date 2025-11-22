export type NoteType = 'text' | 'todo';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'slate';

export interface Note {
  id: string;
  title: string;
  content: string; // Used for text notes
  items: TodoItem[]; // Used for todo notes
  type: NoteType;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isPinned?: boolean;
  color?: ThemeColor;
}

export type Language = 'en' | 'de';

export interface AppSettings {
  theme: ThemeColor;
  darkMode: boolean;
  language: Language;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  border: string;
  ring: string;
}

export type ViewState = 
  | { type: 'DASHBOARD' }
  | { type: 'SETTINGS' }
  | { type: 'EDITOR'; noteId?: string; mode?: NoteType };

export type SortKey = 'updatedAt' | 'title' | 'type';
export type SortDirection = 'asc' | 'desc';