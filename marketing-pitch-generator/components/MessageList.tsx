

import React, { useState } from 'react';
import { Narrative, SocialMediaPosts } from '../types';
import ImagePreviewModal from './ImagePreviewModal';
import SocialMediaModal from './SocialMediaModal';

interface MessageListProps {
  narrative: Narrative | null;
  onGenerateImage: () => void;
  onGenerateVideo: () => void;
  isImageLoading: boolean;
  isVideoLoading: boolean;
  imageError: string | null;
  videoError: string | null;
  generatedImage: string | null;
  generatedVideo: string | null;
  // New props for social media posts
  onGenerateSocialPosts: () => void;
  isSocialPostsLoading: boolean;
  socialPostsError: string | null;
  socialPosts: SocialMediaPosts | null;
  isSocialModalOpen: boolean;
  onCloseSocialModal: () => void;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const NarrativeCard: React.FC<{ title: string; content: string; icon: React.ReactNode; explanation: string }> = ({ title, content, icon, explanation }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{content}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        <strong className="font-semibold text-gray-600 dark:text-gray-300">Why this works:</strong> {explanation}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const VisualAssetGenerator: React.FC<Omit<MessageListProps, 'narrative'>> = (props) => {
    const { 
        onGenerateImage, onGenerateVideo, isImageLoading, isVideoLoading, imageError, videoError, generatedImage, generatedVideo,
        onGenerateSocialPosts, isSocialPostsLoading, socialPostsError, socialPosts, isSocialModalOpen, onCloseSocialModal
    } = props;
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleDownloadImage = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'marketing-collage.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <>
            {isPreviewOpen && generatedImage && (
                <ImagePreviewModal imageUrl={generatedImage} onClose={() => setIsPreviewOpen(false)} />
            )}
            {isSocialModalOpen && socialPosts && (
                <SocialMediaModal posts={socialPosts} onClose={onCloseSocialModal} />
            )}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6">Generate Visual Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Generation */}
                    <div className="flex flex-col items-center space-y-4">
                        <button onClick={onGenerateImage} disabled={isImageLoading || isVideoLoading || isSocialPostsLoading} className="w-full max-w-xs bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2">
                            {isImageLoading ? 'Generating...' : 'Generate Marketing Image'}
                        </button>
                        {imageError && <p className="text-sm text-red-500 dark:text-red-400 text-center">{imageError}</p>}
                        
                        {(generatedImage || isImageLoading) && (
                            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden group relative flex items-center justify-center">
                                {generatedImage && (
                                    <img src={generatedImage} alt="Generated marketing visual" className={`w-full h-full object-contain transition-all duration-300 group-hover:scale-105 ${isImageLoading ? 'opacity-40' : ''}`} />
                                )}

                                {isImageLoading && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-10">
                                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="mt-2 text-sm font-semibold">{generatedImage ? 'Regenerating Image...' : 'Generating Image...'}</p>
                                    </div>
                                )}
                                
                                {generatedImage && !isImageLoading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button onClick={() => setIsPreviewOpen(true)} className="text-white p-3 bg-black/50 rounded-full hover:bg-black/75 transition-colors" title="Preview Image">
                                            <EyeIcon className="w-6 h-6" />
                                        </button>
                                        <button onClick={handleDownloadImage} className="text-white p-3 bg-black/50 rounded-full hover:bg-black/75 transition-colors" title="Download Image">
                                            <DownloadIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {generatedImage && !isImageLoading && (
                            <div className="w-full flex flex-col items-center space-y-2 mt-2">
                                <button onClick={onGenerateSocialPosts} disabled={isSocialPostsLoading} className="w-full max-w-xs bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2">
                                    {isSocialPostsLoading ? 'Generating Posts...' : 'Generate Social Media Posts'}
                                </button>
                                {socialPostsError && <p className="text-sm text-red-500 dark:text-red-400 text-center">{socialPostsError}</p>}
                            </div>
                        )}
                    </div>
                    
                    {/* Video Generation */}
                    <div className="flex flex-col items-center space-y-4">
                        <button onClick={onGenerateVideo} disabled={isImageLoading || isVideoLoading || isSocialPostsLoading} className="w-full max-w-xs bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2">
                            {isVideoLoading ? 'Generating...' : 'Generate Marketing Video'}
                        </button>
                        {videoError && <p className="text-sm text-red-500 dark:text-red-400 text-center">{videoError}</p>}
                        
                        {(generatedVideo || isVideoLoading) && (
                            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                                {generatedVideo && (
                                    <video src={generatedVideo} controls autoPlay loop className={`w-full h-full object-contain transition-opacity duration-300 ${isVideoLoading ? 'opacity-40' : ''}`} />
                                )}

                                {isVideoLoading && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-10 text-center p-4">
                                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="mt-2 text-sm font-semibold">{generatedVideo ? 'Regenerating Video...' : 'Generating Video...'}</p>
                                        <p className="text-xs text-gray-300 mt-1">(This can take a few minutes)</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const MessageList: React.FC<MessageListProps> = ({ narrative, ...visualAssetProps }) => {
  if (!narrative) {
    return null;
  }

  const sections = [
    { title: 'Hook', content: narrative.hook, icon: <HookIcon />, explanation: "It grabs attention and makes your audience curious to hear more. A strong hook is essential to cut through the noise." },
    { title: 'Emotion', content: narrative.emotion, icon: <EmotionIcon />, explanation: "People make decisions based on emotion, then justify with logic. Connecting to a core emotion makes your message more relatable and memorable." },
    { title: 'Conflict', content: narrative.conflict, icon: <ConflictIcon />, explanation: "Clearly defining the problem shows you understand your audience's pain points. A well-defined conflict makes your solution more impactful." },
    { title: 'Resolution', content: narrative.resolution, icon: <ResolutionIcon />, explanation: "This presents your product as the hero that solves the conflict. It provides a clear, satisfying answer to the audience's problem." },
    { title: 'Call to Action', content: narrative.cta, icon: <CtaIcon />, explanation: "A clear and direct CTA tells the audience exactly what to do next, turning their interest into a measurable action and driving results." },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-6">
                {sections.map((section, index) => (
                    <NarrativeCard key={index} {...section} />
                ))}
            </div>
            <VisualAssetGenerator {...visualAssetProps} />
        </div>
    </div>
  );
};

// Icons for different narrative sections
const HookIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const EmotionIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const ConflictIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ResolutionIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CtaIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;

// Icons for visual asset actions
const EyeIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const DownloadIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export default MessageList;