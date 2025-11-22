import React, { useState, useEffect } from 'react';
import { ViewState, Note, NoteType, AppSettings, ThemeColor } from './types';
import { THEMES, ICONS } from './constants';
import * as storage from './services/storageService';
import { TRANSLATIONS } from './translations';

// Components
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { NoteEditor } from './components/NoteEditor';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>({ type: 'DASHBOARD' });
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ theme: 'blue', darkMode: false, language: 'en' });

  // Load Data on Mount
  useEffect(() => {
    const loadedNotes = storage.getNotes();
    const loadedSettings = storage.getSettings();
    setNotes(loadedNotes);
    setSettings(loadedSettings);
  }, []);

  // Handle Dark Mode Class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const currentTheme = THEMES[settings.theme];
  const t = TRANSLATIONS[settings.language];

  // Handlers
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleSaveNote = (note: Note) => {
    storage.saveNote(note);
    setNotes(storage.getNotes()); // Reload to ensure order
    setView({ type: 'DASHBOARD' });
  };

  const handleDeleteNote = (id: string) => {
    // Confirmation is handled in Dashboard component UI
    storage.deleteNote(id);
    setNotes(storage.getNotes());
  };

  const handlePinNote = (id: string, isPinned: boolean) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      const updatedNote = { ...note, isPinned };
      storage.saveNote(updatedNote);
      setNotes(storage.getNotes());
    }
  };

  const handleUpdateNoteColor = (id: string, color: ThemeColor) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      const updatedNote = { ...note, color };
      storage.saveNote(updatedNote);
      setNotes(storage.getNotes());
    }
  };

  const handleEditNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setView({ type: 'EDITOR', noteId: id, mode: note.type });
    }
  };

  const handleCreateNote = (type: NoteType) => {
    setView({ type: 'EDITOR', mode: type });
  };

  // Render View
  const renderContent = () => {
    switch (view.type) {
      case 'DASHBOARD':
        return (
          <Dashboard 
            notes={notes}
            theme={currentTheme}
            language={settings.language}
            onCreateNote={handleCreateNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            onPinNote={handlePinNote}
            onUpdateNoteColor={handleUpdateNoteColor}
          />
        );
      case 'SETTINGS':
        return (
          <Settings 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setView({ type: 'DASHBOARD' })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-[100dvh] w-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      {/* Editor Overlay - Renders on top if active */}
      {view.type === 'EDITOR' && (
        <NoteEditor
          key={view.noteId || 'new'} // Force remount on new note
          note={view.noteId ? notes.find(n => n.id === view.noteId) : undefined}
          initialType={view.mode || 'text'}
          defaultColor={settings.theme} // New notes start with current system theme
          language={settings.language}
          onSave={handleSaveNote}
          onCancel={() => setView({ type: 'DASHBOARD' })}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-4xl mx-auto w-full no-scrollbar">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Only visible on Dashboard/Settings) */}
      {view.type !== 'EDITOR' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 pb-safe pt-2 px-6 h-[80px] z-10">
          <div className="max-w-md mx-auto flex justify-around items-center h-full pb-4">
            <button 
              onClick={() => setView({ type: 'DASHBOARD' })}
              className={`flex flex-col items-center gap-1 transition-colors ${view.type === 'DASHBOARD' ? currentTheme.accent : 'text-gray-400'}`}
            >
              <ICONS.Dashboard size={24} />
              <span className="text-xs font-medium">{t.notes}</span>
            </button>
            
            {/* FAB for Quick Add */}
            <button 
              onClick={() => handleCreateNote('text')}
              className={`-mt-8 w-14 h-14 rounded-full ${currentTheme.primary} text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transform active:scale-95 transition-all`}
            >
              <ICONS.Plus size={28} />
            </button>

            <button 
              onClick={() => setView({ type: 'SETTINGS' })}
              className={`flex flex-col items-center gap-1 transition-colors ${view.type === 'SETTINGS' ? currentTheme.accent : 'text-gray-400'}`}
            >
              <ICONS.Settings size={24} />
              <span className="text-xs font-medium">{t.settings}</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;