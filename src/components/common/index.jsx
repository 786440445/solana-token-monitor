const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary border-t-transparent`}
      />
    </div>
  );
};

const LoadingCard = () => (
  <div className="bg-surface rounded-xl border border-border p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-16 bg-surfaceHover rounded"></div>
        <div className="h-4 w-12 bg-surfaceHover rounded-full"></div>
      </div>
      <div className="h-4 w-4 bg-surfaceHover rounded"></div>
    </div>
    
    <div className="mb-3">
      <div className="h-6 w-32 bg-surfaceHover rounded mb-2"></div>
      <div className="h-3 w-48 bg-surfaceHover rounded"></div>
    </div>
    
    <div className="mb-3">
      <div className="h-8 w-24 bg-surfaceHover rounded"></div>
      <div className="h-4 w-20 bg-surfaceHover rounded mt-2"></div>
    </div>
    
    <div className="grid grid-cols-2 gap-2">
      <div className="h-16 bg-surfaceHover rounded"></div>
      <div className="h-16 bg-surfaceHover rounded"></div>
    </div>
  </div>
);

const LoadingGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <LoadingCard key={index} />
    ))}
  </div>
);

export { LoadingSpinner, LoadingCard, LoadingGrid };
export default LoadingSpinner;
