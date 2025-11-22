import { Note, AppSettings, Language } from '../types';

const NOTES_KEY = 'note4u_notes';
const SETTINGS_KEY = 'note4u_settings';

const getBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.split('-')[0];
  return lang === 'de' ? 'de' : 'en';
};

const defaultSettings: AppSettings = {
  theme: 'blue',
  darkMode: false,
  language: getBrowserLanguage()
};

export const getNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading notes", error);
    return [];
  }
};

export const saveNote = (note: Note): void => {
  const notes = getNotes();
  const existingIndex = notes.findIndex((n) => n.id === note.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = { ...note, updatedAt: Date.now() };
  } else {
    notes.unshift({ ...note, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
};

export const getSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure new fields are present if loading old settings
      return { ...defaultSettings, ...parsed };
    }
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};