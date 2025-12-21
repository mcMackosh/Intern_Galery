import { InputHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  icon?: LucideIcon;
  error?: string;
  labelRight?: ReactNode;
}

export const Input = ({
  id,
  label,
  icon: Icon,
  error,
  labelRight,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <span>{label}</span>
          {labelRight && <span>{labelRight}</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          id={id}
          {...props}
          className={`
            w-full pl-${Icon ? '10' : '4'} pr-4 py-3 rounded-xl
            border ${error ? 'border-red-500' : 'border-gray-300'}
            focus:ring-2 focus:ring-blue-200 focus:border-blue-500
            disabled:bg-gray-100 disabled:text-gray-400
            transition
            ${className}
          `}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
