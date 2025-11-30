type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;