import React from 'react';
import { ThemeColor, AppSettings, Language } from '../types';
import { THEMES, ICONS } from '../constants';
import { TRANSLATIONS } from '../translations';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onClose }) => {
  const colors: ThemeColor[] = ['blue', 'green', 'purple', 'orange', 'slate'];
  const t = TRANSLATIONS[settings.language];

  const toggleDarkMode = () => {
    onUpdateSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const changeTheme = (color: ThemeColor) => {
    onUpdateSettings({ ...settings, theme: color });
  };

  const changeLanguage = (lang: Language) => {
    onUpdateSettings({ ...settings, language: lang });
  }

  return (
    <div className="flex flex-col h-full animate-fade-in pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t.settings}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t.settingsSub}</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.appearance}</h3>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {settings.darkMode ? <ICONS.Moon size={20} /> : <ICONS.Sun size={20} />}
              </div>
              <span className="text-gray-700 dark:text-gray-200">{t.darkMode}</span>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.darkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="mb-6">
            <span className="block text-sm text-gray-500 mb-3">{t.accentColor}</span>
            <div className="flex gap-4 justify-between sm:justify-start">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => changeTheme(color)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 ${THEMES[color].primary}`}
                >
                  {settings.theme === color && <ICONS.Todo className="text-white" size={20} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <ICONS.Globe size={20} />
               </div>
               <span className="text-gray-700 dark:text-gray-200">{t.language}</span>
            </div>
            <div className="flex gap-3">
               <button 
                 onClick={() => changeLanguage('en')}
                 className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${settings.language === 'en' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
               >
                 English
               </button>
               <button 
                 onClick={() => changeLanguage('de')}
                 className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${settings.language === 'de' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
               >
                 Deutsch
               </button>
            </div>
          </div>

        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.about}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {t.aboutText}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 text-center">
            v1.1.0 • Mobile First Design
          </div>
        </div>
      </div>
    </div>
  );
};