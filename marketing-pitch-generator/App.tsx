import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/ChatInput';
import MessageList from './components/MessageList';
import LoadingIndicator from './components/LoadingIndicator';
import { Narrative, SocialMediaPosts } from './types';
import { generateNarrative, generateMarketingImage, generateMarketingVideo, generateSocialMediaPosts } from './services/openRouterService';
import FrameworkExplanation from './components/FrameworkExplanation';

// Mock the aistudio object for local development if it doesn't exist
if (typeof window.aistudio === 'undefined') {
  // Fix: Add mock implementations for missing properties to satisfy the AIStudio type.
  (window as any).aistudio = {
    hasSelectedApiKey: () => Promise.resolve(true),
    openSelectKey: () => Promise.resolve(),
    getHostUrl: () => Promise.resolve(''),
    getModelQuota: () => Promise.resolve({ limit: 0, usage: 0 }),
  };
}

const App: React.FC = () => {
  const [description, setDescription] = useState('');
  const [narrative, setNarrative] = useState<Narrative | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // State for visual assets
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  // State for social media posts
  const [socialPosts, setSocialPosts] = useState<SocialMediaPosts | null>(null);
  const [isSocialPostsLoading, setIsSocialPostsLoading] = useState(false);
  const [socialPostsError, setSocialPostsError] = useState<string | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);


  useEffect(() => {
    // Initialize theme based on saved preference or system setting
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  // Cleanup effect for video object URL
  useEffect(() => {
    return () => {
      if (generatedVideo) {
        URL.revokeObjectURL(generatedVideo);
      }
    };
  }, [generatedVideo]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const resetVisuals = () => {
    setGeneratedImage(null);
    setGeneratedVideo(null);
    setImageError(null);
    setVideoError(null);
    setSocialPosts(null);
    setSocialPostsError(null);
  };

  const handleGeneratePitch = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setError(null);
    setNarrative(null);
    resetVisuals();

    try {
      const result = await generateNarrative(description);
      setNarrative(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!narrative || !description) return;
    setIsImageLoading(true);
    setImageError(null);
    try {
        const imageBase64 = await generateMarketingImage(narrative, description);
        setGeneratedImage(`data:image/png;base64,${imageBase64}`);
    } catch (err: any) {
        setImageError(err.message || 'Failed to generate image.');
    } finally {
        setIsImageLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!narrative) return;

    try {
      if (!(await window.aistudio.hasSelectedApiKey())) {
          await window.aistudio.openSelectKey();
      }
    } catch (e) {
        setVideoError("Could not verify API key. Please ensure you've selected one.");
        return;
    }
    
    setIsVideoLoading(true);
    setVideoError(null);

    try {
        const videoUrl = await generateMarketingVideo(narrative);
        setGeneratedVideo(videoUrl);
    } catch (err: any) {
        if (err.message.includes("Requested entity was not found")) {
            setVideoError("Video generation failed. Your API key might be invalid. Please re-select your key via the prompt.");
             // Reset key selection state assumption
        } else {
            setVideoError(err.message || 'Failed to generate video.');
        }
    } finally {
        setIsVideoLoading(false);
    }
  };
  
  const handleGenerateSocialPosts = async () => {
    if (!narrative || !description) return;

    setIsSocialPostsLoading(true);
    setSocialPostsError(null);
    try {
        const posts = await generateSocialMediaPosts(narrative, description);
        setSocialPosts(posts);
        setIsSocialModalOpen(true);
    } catch (err: any) {
        setSocialPostsError(err.message || 'Failed to generate social media posts.');
    } finally {
        setIsSocialPostsLoading(false);
    }
  };


  const handleSignOut = () => {
    setDescription('');
    setNarrative(null);
    setError(null);
    setIsLoading(false);
    resetVisuals();
    console.log("App state cleared.");
  };

  const LeftPanel = () => (
    <div className="w-full md:w-2/5 lg:w-1/3 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <InputForm
        description={description}
        setDescription={setDescription}
        onGeneratePitch={handleGeneratePitch}
        isLoading={isLoading}
      />
    </div>
  );

  const RightPanel = () => (
    <div className="flex-1 overflow-y-auto">
        {isLoading && <LoadingIndicator />}

        {error && (
            <div className="h-full flex items-center justify-center p-4 text-center">
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            </div>
        )}
        
        {!isLoading && !error && narrative && (
            <MessageList 
                narrative={narrative}
                onGenerateImage={handleGenerateImage}
                onGenerateVideo={handleGenerateVideo}
                isImageLoading={isImageLoading}
                isVideoLoading={isVideoLoading}
                imageError={imageError}
                videoError={videoError}
                generatedImage={generatedImage}
                generatedVideo={generatedVideo}
                onGenerateSocialPosts={handleGenerateSocialPosts}
                isSocialPostsLoading={isSocialPostsLoading}
                socialPostsError={socialPostsError}
                socialPosts={socialPosts}
                isSocialModalOpen={isSocialModalOpen}
                onCloseSocialModal={() => setIsSocialModalOpen(false)}
            />
        )}

        {!isLoading && !error && !narrative && (
            <div className="h-full overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="w-full max-w-4xl mx-auto text-center">
                  <div className="max-w-md mx-auto">
                      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Unlock Your Pitch</h2>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                          Describe your business or idea, and I'll generate a compelling marketing narrative using the <strong>Hook, Emotion, Conflict, Resolution, and Call to Action</strong> framework.
                      </p>
                  </div>
                  <div className="mt-8">
                      <FrameworkExplanation />
                  </div>
              </div>
            </div>
        )}
    </div>
  );


  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header onSignOut={handleSignOut} theme={theme} toggleTheme={toggleTheme} />
        
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <LeftPanel />
            <RightPanel />
        </main>
    </div>
  );
};

export default App;