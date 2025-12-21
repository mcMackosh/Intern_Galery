import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

interface IconDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const IconDatePicker = ({
  selected,
  onChange,
  placeholder,
  minDate,
  maxDate,
}: IconDatePickerProps) => {
  return (
    <div className="relative">
      <Calendar
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
      />
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholder}
        isClearable
        minDate={minDate}
        maxDate={maxDate}
        className="w-full pl-10 pr-4 py-3 rounded-xl
                   border border-gray-300
                   focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      />
    </div>
  );
};
