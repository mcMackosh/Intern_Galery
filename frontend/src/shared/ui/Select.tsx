import { ChevronDown } from 'lucide-react';
import React from 'react';

interface Option<T = string> {
  value: T;
  label: string;
}

interface SelectProps<T = string> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export const Select = <T extends string>({
  value,
  options,
  onChange,
  placeholder,
  className = '',
}: SelectProps<T>) => {
  return (
    <div className={`relative w-full ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="
          appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl
          bg-white shadow-sm hover:shadow-md hover:border-gray-400 transition
          focus:outline-none focus:ring-2
          cursor-pointer
        "
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
      />
    </div>
  );
};
