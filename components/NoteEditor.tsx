import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Note, NoteType, TodoItem, ThemeConfig, Language, ThemeColor } from '../types';
import { ICONS, THEMES } from '../constants';
import { Button } from './Button';
import { generateNoteContent } from '../services/geminiService';
import { TRANSLATIONS } from '../translations';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface NoteEditorProps {
  note?: Note;
  initialType: NoteType;
  defaultColor: ThemeColor;
  language: Language;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  note, 
  initialType, 
  defaultColor,
  language,
  onSave, 
  onCancel 
}) => {
  const t = TRANSLATIONS[language];
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [items, setItems] = useState<TodoItem[]>(note?.items || []);
  const [type] = useState<NoteType>(note?.type || initialType);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [color] = useState<ThemeColor>(note?.color || defaultColor); // Initialize with note color or system default
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  
  // New State for View/Edit Mode
  const [isViewMode, setIsViewMode] = useState(false);

  // Derive the theme configuration based on the specific note color
  const activeTheme = THEMES[color];

  // Focus title on mount if new
  const titleRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!note) {
      titleRef.current?.focus();
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim() && !content.trim() && items.length === 0) {
      onCancel();
      return;
    }

    const newNote: Note = {
      id: note?.id || generateId(),
      title: title || t.untitled,
      content,
      items,
      type,
      isPinned,
      color, // Save the color
      createdAt: note?.createdAt || Date.now(),
      updatedAt: Date.now(),
      tags: note?.tags || []
    };
    onSave(newNote);
  };

  const handleAddItem = () => {
    setItems([...items, { id: generateId(), text: '', done: false }]);
  };

  const updateItem = (id: string, updates: Partial<TodoItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    
    const result = await generateNoteContent(aiPrompt, type);
    
    if (result) {
      setTitle(result.title);
      if (type === 'text' && result.content) {
        setContent(result.content);
      } else if (type === 'todo' && result.items) {
        setItems(result.items.map(text => ({ id: generateId(), text, done: false })));
      }
      setShowAiModal(false);
      // Automatically switch to view mode for text notes after AI generation to show off formatting
      if (type === 'text') setIsViewMode(true);
    }
    
    setIsAiLoading(false);
    setAiPrompt('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 absolute inset-0 z-20 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ICONS.Back size={24} />
        </Button>
        <div className="flex gap-2 items-center">
           
           {/* View/Edit Toggle for Text Notes */}
           {type === 'text' && (
             <Button
               variant="ghost"
               size="icon"
               onClick={() => setIsViewMode(!isViewMode)}
               className="text-gray-500 dark:text-gray-400"
               title={isViewMode ? t.editMode : t.viewMode}
             >
               {isViewMode ? <ICONS.Edit size={20} /> : <ICONS.View size={20} />}
             </Button>
           )}

           <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsPinned(!isPinned)}
            className={isPinned ? activeTheme.accent : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}
            title={t.pin}
          >
            <ICONS.Pin size={20} fill={isPinned ? "currentColor" : "none"} />
          </Button>

          <Button 
            variant="secondary" 
            size="sm" 
            icon={<ICONS.AI size={16} className={activeTheme.accent} />}
            onClick={() => setShowAiModal(true)}
            className="hidden sm:inline-flex"
          >
            {t.aiAssist}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden"
            onClick={() => setShowAiModal(true)}
          >
            <ICONS.AI size={20} className={activeTheme.accent} />
          </Button>
          <Button 
            themeClass={activeTheme.primary} 
            size="sm" 
            icon={<ICONS.Save size={16} />} 
            onClick={handleSave}
          >
            {t.save}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <input
          ref={titleRef}
          type="text"
          placeholder={t.title}
          value={title}
          readOnly={isViewMode}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-6 text-gray-900 dark:text-white"
        />

        {type === 'text' ? (
          isViewMode ? (
            <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-800 dark:text-gray-200 markdown-body">
               {/* Use ReactMarkdown to render the content safely */}
               <ReactMarkdown>{content || `*${t.noContent}*`}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              placeholder={t.startTyping}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(100vh-200px)] resize-none bg-transparent border-none outline-none text-lg leading-relaxed text-gray-800 dark:text-gray-200"
            />
          )
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 group">
                <button
                  onClick={() => updateItem(item.id, { done: !item.done })}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    item.done 
                      ? `${activeTheme.primary} border-transparent text-white` 
                      : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-gray-400'
                  }`}
                >
                  <ICONS.Todo size={14} strokeWidth={4} />
                </button>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, { text: e.target.value })}
                  placeholder={t.taskItem}
                  className={`flex-1 bg-transparent border-none outline-none text-lg transition-all ${
                    item.done ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddItem();
                    if (e.key === 'Backspace' && item.text === '') deleteItem(item.id);
                  }}
                />
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <ICONS.Close size={18} />
                </button>
              </div>
            ))}
            <button 
              onClick={handleAddItem}
              className={`flex items-center gap-3 text-gray-400 hover:${activeTheme.accent} transition-colors mt-4 pl-0.5`}
            >
              <ICONS.Plus size={20} />
              <span className="font-medium">{t.addItem}</span>
            </button>
          </div>
        )}
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ICONS.AI className={activeTheme.accent} size={24} />
                <h3 className="text-xl font-bold dark:text-white">{t.aiAssist}</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-gray-500">
                <ICONS.Close size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              {t.aiDescription}
            </p>
            
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={t.aiPromptPlaceholder}
              className={`w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 ${activeTheme.ring} outline-none mb-4 dark:text-white`}
              autoFocus
            />
            
            <Button 
              themeClass={activeTheme.primary} 
              className="w-full"
              disabled={isAiLoading || !aiPrompt.trim()}
              onClick={handleAiGenerate}
            >
              {isAiLoading ? t.generating : t.generateContent}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};