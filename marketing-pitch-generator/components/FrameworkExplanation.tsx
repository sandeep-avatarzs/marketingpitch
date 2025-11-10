import React, { useState } from 'react';

const HookIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const EmotionIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const ConflictIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ResolutionIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CtaIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>

const faqData = [
    {
        icon: <HookIcon />,
        title: "The Hook: Grab Attention Instantly",
        content: "In a world saturated with information, you have seconds to capture interest. The hook is a provocative question, a surprising statistic, or a bold statement that cuts through the noise and makes your audience lean in, eager to learn more."
    },
    {
        icon: <EmotionIcon />,
        title: "The Emotion: Connect on a Human Level",
        content: "Logic makes people think, but emotion makes them act. By tapping into a core human emotion—like frustration with a problem or the joy of a solution—you create a memorable and relatable experience that builds a genuine connection with your audience."
    },
    {
        icon: <ConflictIcon />,
        title: "The Conflict: Frame the Problem",
        content: "Clearly defining the 'villain' of your story (the problem your audience faces) makes your product the clear 'hero'. This tension is the heart of any good story; it highlights the stakes and makes the need for a solution urgent and undeniable."
    },
    {
        icon: <ResolutionIcon />,
        title: "The Resolution: Present the Solution",
        content: "This is where you show how your product or service saves the day. The resolution provides a satisfying conclusion to the conflict you've established, demonstrating tangible value and painting a clear picture of a better future for your customer."
    },
    {
        icon: <CtaIcon />,
        title: "The Call to Action: Guide the Next Step",
        content: "A compelling story is wasted without a clear next step. The Call to Action (CTA) channels the momentum you've built into a specific, measurable action. It transforms passive listeners into active participants, whether that's signing up, making a purchase, or learning more."
    }
];

const AccordionItem: React.FC<{ item: typeof faqData[0]; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <h2>
            <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <div className="flex items-center space-x-3">
                    <span className="text-blue-500 dark:text-blue-400">{item.icon}</span>
                    <span>{item.title}</span>
                </div>
                <ChevronDownIcon className={`w-6 h-6 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </h2>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} grid`}>
            <div className="overflow-hidden">
                <div className="p-5 border-t-0 border-gray-200 dark:border-gray-700">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">{item.content}</p>
                </div>
            </div>
        </div>
    </div>
);


const FrameworkExplanation: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">The Power of Narrative</h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Great marketing isn't about listing features; it's about telling a story. This framework turns your idea into a narrative that connects emotionally, making your pitch more memorable and persuasive.
            </p>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden">
                {faqData.map((item, index) => (
                    <AccordionItem 
                        key={index} 
                        item={item} 
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FrameworkExplanation;
