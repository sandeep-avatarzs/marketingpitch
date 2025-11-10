import React, { useState, useEffect } from 'react';
import { SocialMediaPosts } from '../types';

interface SocialMediaModalProps {
    posts: SocialMediaPosts;
    onClose: () => void;
}

// Icons
const CloseIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CopyIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042m-7.416 0v3.042c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>;
const CheckIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;

const platformConfig = {
    youtube: { name: 'YouTube', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M19.802 5.512a3.75 3.75 0 013.44 4.493l-2.436 9.014a3.75 3.75 0 01-4.322 2.719l-9.31-2.496a3.75 3.75 0 01-2.718-4.322l2.436-9.014a3.75 3.75 0 014.322-2.719l9.31 2.496zM15.44 11.218a.75.75 0 00-1.28-.53l-3.38 3.38a.75.75 0 00.53 1.28l3.38-3.38z" clipRule="evenodd" /><path d="M4.198 5.512a3.75 3.75 0 014.322-2.719l9.31 2.496a3.75 3.75 0 013.44 4.493l-1.41 5.228-12.72-3.41-3.6-1.34v-.022l.658-2.436z" /></svg> },
    instagram: { name: 'Instagram', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7.042a5.208 5.208 0 100 10.416 5.208 5.208 0 000-10.416zm0 8.708a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm4.838-9.88a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg> },
    linkedin: { name: 'LinkedIn', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93-.8 0-1.32.53-1.54 1.05-.08.18-.1 1.25-.1 1.25V19h-3s.04-8.17 0-9h3v1.36h.04c.42-.71 1.43-1.46 2.96-1.46 2.16 0 3.84 1.3 3.84 4.22V19z" /></svg> },
    facebook: { name: 'Facebook', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg> },
    x: { name: 'X', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
};

type Platform = keyof SocialMediaPosts;

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ posts, onClose }) => {
    const [activeTab, setActiveTab] = useState<Platform>('youtube');
    const [copied, setCopied] = useState<Platform | null>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleCopy = (text: string, platform: Platform) => {
        navigator.clipboard.writeText(text);
        setCopied(platform);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Social Media Posts"
        >
            <div 
                className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Generated Social Media Posts</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <CloseIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="flex flex-col flex-grow min-h-0">
                    <div className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
                            {(Object.keys(posts) as Platform[]).map((platform) => (
                                <button
                                    key={platform}
                                    onClick={() => setActiveTab(platform)}
                                    className={`whitespace-nowrap flex items-center gap-2 py-3 px-2 sm:px-3 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === platform
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                                    }`}
                                >
                                    {platformConfig[platform].icon}
                                    {platformConfig[platform].name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="relative pt-4 flex-grow overflow-y-auto">
                        {(Object.keys(posts) as Platform[]).map((platform) => (
                            <div key={platform} className={activeTab === platform ? 'block' : 'hidden'}>
                                <div className="relative">
                                    <button 
                                        onClick={() => handleCopy(posts[platform], platform)}
                                        className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-semibold py-1 px-3 rounded-md text-sm flex items-center gap-2 transition-colors"
                                    >
                                        {copied === platform ? <><CheckIcon className="w-4 h-4 text-green-500" /> Copied</> : <><CopyIcon className="w-4 h-4" /> Copy</>}
                                    </button>
                                    <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg text-gray-700 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                                        {posts[platform]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default SocialMediaModal;
