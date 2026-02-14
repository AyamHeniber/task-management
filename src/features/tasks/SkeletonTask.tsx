import React from 'react';

const SkeletonTask: React.FC = () => {
  return (
    <div data-testid="skeleton-task" className="glass-card !bg-surface-100/50 p-8 flex flex-col gap-6 animate-pulse border-border">
      <div className="flex justify-between items-center">
        <div className="w-16 h-4 bg-surface-200 rounded-full"></div>
        <div className="w-4 h-4 bg-surface-200 rounded-full"></div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-3/4 h-6 bg-surface-200 rounded-lg"></div>
        <div className="w-full h-12 bg-surface-200 rounded-lg opacity-50"></div>
      </div>
      <div className="flex gap-3 pt-6 border-t border-border-subtle mt-4">
        <div className="flex-1 h-10 bg-surface-200 rounded-xl"></div>
        <div className="flex-1 h-10 bg-surface-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonTask;
