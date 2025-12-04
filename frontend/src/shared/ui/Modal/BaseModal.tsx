"use client";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;  
}

export const BaseModal = ({ isOpen, onClose, children, className = "" }: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow-lg p-6 relative ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl cursor-auto"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};
