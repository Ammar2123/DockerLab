import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const SplashScreen = () => {
  const { darkMode } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${
      darkMode ? 'bg-surface-900' : 'bg-surface-50'
    } transition-colors duration-300 z-50`}>
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 mb-8 animate-pulse">
          <img 
            src="/vite.svg" 
            alt="DockerLab Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className={`text-3xl font-bold mb-6 ${
          darkMode ? 'text-primary-400' : 'text-primary-700'
        } animate-slide-up`}>
          DockerLab
        </h1>
        
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className={`mt-4 text-sm ${
          darkMode ? 'text-surface-400' : 'text-surface-500'
        }`}>
          Loading resources...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;