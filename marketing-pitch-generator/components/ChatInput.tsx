import React from 'react';

interface InputFormProps {
  description: string;
  setDescription: (value: string) => void;
  onGeneratePitch: () => void;
  isLoading: boolean;
}

const WandIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69a.75.75 0 01.981.981A10.503 10.503 0 0118 19.5a10.5 10.5 0 01-10.5-10.5A10.503 10.503 0 019.34 1.88a.75.75 0 01.188-.162zM19.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM6 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);


const InputForm: React.FC<InputFormProps> = ({ description, setDescription, onGeneratePitch, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;
    onGeneratePitch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 flex-grow">
        <label htmlFor="description-input" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Your Idea or Business Description <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(be more descriptive for better results)</span>
        </label>
        <textarea
            id="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., An app that uses AI to create personalized workout plans based on your fitness level and available equipment..."
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y flex-grow"
            disabled={isLoading}
            aria-label="Your Idea or Business Description"
        />
        <div className="flex flex-col items-center space-y-2">
            <button
                type="submit"
                disabled={isLoading || !description.trim()}
                className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <WandIcon className="w-5 h-5"/>
                        <span>Generate Marketing Pitch</span>
                    </>
                )}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-500">Click to regenerate for different versions.</p>
        </div>
    </form>
  );
};

export default InputForm;