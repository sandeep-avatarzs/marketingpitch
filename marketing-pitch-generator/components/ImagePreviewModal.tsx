
import React, { useEffect } from 'react';

interface ImagePreviewModalProps {
    imageUrl: string;
    onClose: () => void;
}

const DownloadIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const CloseIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'marketing-collage.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image Preview"
        >
            <div 
                className="bg-gray-900 rounded-lg shadow-2xl p-4 relative max-w-4xl max-h-full w-full h-auto animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-red-600 transition-colors z-10"
                    aria-label="Close preview"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full max-h-[80vh]">
                   <img src={imageUrl} alt="Generated marketing collage preview" className="w-full h-full object-contain rounded" />
                </div>
                
                <div className="mt-4 text-center">
                    <button 
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <DownloadIcon className="w-5 h-5"/>
                        <span>Download Image</span>
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-up {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ImagePreviewModal;
