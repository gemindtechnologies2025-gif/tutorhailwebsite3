// components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress in percentage (0 - 100)
  height?: string;
  color?: string;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = '10px',
  color = '#4caf50',
  backgroundColor = '#e0e0e0',
}) => {
  return (
    <div
      style={{
        backgroundColor,
        borderRadius: '10px',
        height,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${Math.min(Math.max(progress, 0), 100)}%`,
          backgroundColor: color,
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

export default ProgressBar;
