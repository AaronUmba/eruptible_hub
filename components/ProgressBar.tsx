
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const cappedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full bg-subtle rounded-full h-2">
      <div
        className="bg-brand h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${cappedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
