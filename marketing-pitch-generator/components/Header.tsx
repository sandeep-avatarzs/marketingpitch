import React from 'react';

interface HeaderProps {
    onSignOut: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const SignOutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const HeaderIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onSignOut, theme, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between z-20 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <HeaderIcon />
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Marketing Pitch Generator</h1>
      </div>
       <div className="flex items-center space-x-4">
        <button
            onClick={toggleTheme}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 transition-colors duration-200"
            aria-label="Toggle theme"
            title="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
        <button
            onClick={onSignOut}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
            aria-label="Sign Out and clear API Key"
            title="Sign Out"
        >
            <SignOutIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;