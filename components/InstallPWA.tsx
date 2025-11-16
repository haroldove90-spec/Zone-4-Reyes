
import React, { useState, useEffect } from 'react';

const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}

const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

const InstallPWA: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (!isInStandaloneMode()) {
                setShowInstallBanner(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Show prompt for iOS if not in standalone mode
        if (isIos() && !isInStandaloneMode()) {
            setShowInstallBanner(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = () => {
        setShowInstallBanner(false);
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                setDeferredPrompt(null);
            });
        }
    };
    
    const handleClose = () => {
        setShowInstallBanner(false);
    }

    if (!showInstallBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-lg p-4 z-50 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center">
                <img src="https://appdesignmex.com/iconoreyes.png" alt="App Icon" className="h-12 w-12 mr-4" />
                <div>
                    <h3 className="font-bold text-z-text-primary dark:text-z-text-primary-dark">Install Zone4Reyes App</h3>
                    <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">Add to your home screen for a better experience.</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {isIos() ? (
                     <p className="text-sm text-z-text-primary dark:text-z-text-primary-dark font-medium">Tap 'Share' then 'Add to Home Screen'</p>
                ) : (
                    <button onClick={handleInstallClick} className="bg-z-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-z-dark-blue transition-colors">
                        Install
                    </button>
                )}
                 <button onClick={handleClose} className="text-z-text-secondary dark:text-z-text-secondary-dark font-medium py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark">
                    Not now
                </button>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default InstallPWA;
