type LoaderProps = {
  className?: string;
};

export const Loader = ({ className = "" }: LoaderProps) => {
  return (
    <div data-testid="loader" className={`flex items-center justify-center w-full min-h-[150px] ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
};