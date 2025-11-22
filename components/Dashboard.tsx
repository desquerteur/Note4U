import React, { useMemo, useState, useEffect } from 'react';
import { Note, ThemeConfig, SortKey, SortDirection, Language, ThemeColor } from '../types';
import { ICONS, THEMES } from '../constants';
import { Button } from './Button';
import { TRANSLATIONS } from '../translations';

interface DashboardProps {
  notes: Note[];
  theme: ThemeConfig;
  language: Language;
  onCreateNote: (type: 'text' | 'todo') => void;
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onPinNote: (id: string, isPinned: boolean) => void;
  onUpdateNoteColor: (id: string, color: ThemeColor) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  notes, 
  theme, 
  language,
  onCreateNote, 
  onEditNote,
  onDeleteNote,
  onPinNote,
  onUpdateNoteColor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'updatedAt',
    direction: 'desc'
  });
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];
  const themeColors: ThemeColor[] = ['blue', 'green', 'purple', 'orange', 'slate'];

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuId) setActiveMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const sortedNotes = useMemo(() => {
    const result = [...filteredNotes];
    
    result.sort((a, b) => {
      // Priority 1: Pinned Status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Priority 2: Selected Sort Config
      let comparison = 0;
      switch (sortConfig.key) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'updatedAt':
        default:
          comparison = a.updatedAt - b.updatedAt;
          break;
      }
      
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [filteredNotes, sortConfig]);

  const stats = useMemo(() => {
    const total = notes.length;
    const todos = notes.filter(n => n.type === 'todo').length;
    const text = notes.filter(n => n.type === 'text').length;
    return { total, todos, text };
  }, [notes]);

  const handleSortOption = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setShowSortMenu(false);
  };

  const handleDirection = (direction: SortDirection) => {
    setSortConfig(prev => ({ ...prev, direction }));
    setShowSortMenu(false);
  };

  // Helper to strip markdown for preview
  const getPreviewText = (text: string) => {
    if (!text) return t.noContent;
    // Remove markdown headers, bold, italic, etc.
    return text
      .replace(/[#*`_~\[\]]/g, '') // Remove common symbols
      .replace(/\n/g, ' ') // Replace newlines with space
      .substring(0, 100); // Limit length
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in relative">
      {/* Header & Stats */}
      <div className={`${theme.primary} rounded-3xl p-6 text-white shadow-lg transition-colors duration-500`}>
        <h1 className="text-2xl font-bold mb-1">{t.welcome}</h1>
        <p className="opacity-90 text-sm mb-6">{t.subtitle}</p>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 text-center">
            <span className="block text-2xl font-bold">{stats.total}</span>
            <span className="text-xs opacity-80">{t.total}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 text-center">
            <span className="block text-2xl font-bold">{stats.text}</span>
            <span className="text-xs opacity-80">{t.notes}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 text-center">
            <span className="block text-2xl font-bold">{stats.todos}</span>
            <span className="text-xs opacity-80">{t.lists}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onCreateNote('text')}
          className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        >
          <div className={`p-3 rounded-full ${theme.secondary} ${theme.accent}`}>
            <ICONS.Note size={24} />
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-200">{t.newNote}</span>
        </button>
        <button 
          onClick={() => onCreateNote('todo')}
          className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        >
          <div className={`p-3 rounded-full ${theme.secondary} ${theme.accent}`}>
            <ICONS.Todo size={24} />
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-200">{t.newList}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <ICONS.Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full bg-white dark:bg-gray-800 pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 ${theme.ring} outline-none transition-all text-gray-900 dark:text-white`}
        />
      </div>

      {/* Recent Notes List Header with Sorting */}
      <div className="flex justify-between items-center relative z-20">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t.recentNotes}</h2>
        
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded-lg transition-colors"
          >
            <span className="hidden sm:inline">{t.sort}</span>
            <ICONS.Sort size={16} />
          </button>

          {showSortMenu && (
            <div 
              className="absolute right-0 top-full mt-2 min-w-[200px] w-max max-w-[80vw] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.sortBy}</div>
                
                {[
                  { label: t.name, key: 'title' },
                  { label: t.dateModified, key: 'updatedAt' },
                  { label: t.type, key: 'type' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSortOption(option.key as SortKey)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <span className="mr-3">{option.label}</span>
                    {sortConfig.key === option.key && <ICONS.Check size={14} className={theme.accent} />}
                  </button>
                ))}

                <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.order}</div>

                <button
                  onClick={() => handleDirection('asc')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <span>{t.ascending}</span>
                  {sortConfig.direction === 'asc' && <ICONS.Check size={14} className={theme.accent} />}
                </button>
                <button
                  onClick={() => handleDirection('desc')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <span>{t.descending}</span>
                  {sortConfig.direction === 'desc' && <ICONS.Check size={14} className={theme.accent} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes List */}
      <div className="relative z-10">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>{t.noNotes}</p>
            <p className="text-sm">{t.noNotesSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sortedNotes.map(note => {
              const noteTheme = THEMES[note.color || 'blue'];
              return (
                <div 
                  key={note.id}
                  onClick={() => onEditNote(note.id)}
                  className="group bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer relative overflow-visible"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${noteTheme.primary}`}></div>
                  
                  {/* Pin Indicator */}
                  {note.isPinned && (
                    <div className="absolute left-4 top-3 text-gray-400 dark:text-gray-500">
                      <ICONS.Pin size={14} fill="currentColor" className={noteTheme.accent} />
                    </div>
                  )}

                  <div className="flex justify-between items-start pl-3">
                    <div className="flex-1 min-w-0 pr-8">
                       <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{note.title || t.untitled}</h3>
                       </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1 h-5">
                        {note.type === 'todo' 
                          ? `${note.items.filter(i => i.done).length}/${note.items.length} ${t.itemsDone}`
                          : getPreviewText(note.content)}
                      </p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Settings Menu Button */}
                    <div className="absolute right-2 top-2">
                       <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setActiveMenuId(activeMenuId === note.id ? null : note.id); 
                        }}
                        className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <ICONS.More size={20} />
                      </button>
                      
                      {/* Note Options Dropdown */}
                      {activeMenuId === note.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-30 animate-fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            onClick={() => {
                              onPinNote(note.id, !note.isPinned);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <ICONS.Pin size={16} className={note.isPinned ? noteTheme.accent : ''} />
                            {note.isPinned ? t.unpinNote : t.pinNote}
                          </button>

                          <div className="border-t border-gray-100 dark:border-gray-700"></div>
                          
                          <div className="flex items-center justify-center gap-2 px-2 py-2 bg-gray-50 dark:bg-gray-800/50">
                            {themeColors.map(color => (
                              <button
                                key={color}
                                onClick={() => {
                                  onUpdateNoteColor(note.id, color);
                                  setActiveMenuId(null);
                                }}
                                className={`w-5 h-5 rounded-full ${THEMES[color].primary} hover:opacity-80 transition-opacity ring-2 ${note.color === color || (!note.color && color === 'blue') ? 'ring-offset-2 ring-gray-300 dark:ring-gray-500' : 'ring-transparent'}`}
                              />
                            ))}
                          </div>

                          <div className="border-t border-gray-100 dark:border-gray-700"></div>
                          <button 
                            onClick={() => {
                              setDeleteConfirmId(note.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <ICONS.Delete size={16} />
                            {t.deleteNote}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center text-center mb-6">
                 <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                    <ICONS.Alert size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.deleteConfirmTitle}</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm">{t.deleteConfirmText}</p>
              </div>
              <div className="flex gap-3">
                 <Button 
                    variant="ghost" 
                    className="flex-1" 
                    onClick={() => setDeleteConfirmId(null)}
                 >
                    {t.cancel}
                 </Button>
                 <Button 
                    variant="danger" 
                    className="flex-1" 
                    onClick={() => {
                       onDeleteNote(deleteConfirmId);
                       setDeleteConfirmId(null);
                    }}
                 >
                    {t.delete}
                 </Button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};