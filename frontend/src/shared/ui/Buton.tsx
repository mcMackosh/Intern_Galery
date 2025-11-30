const Button = ({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) => (
  <button
    disabled={disabled}
    type="submit"
    className={`w-full py-2 text-white rounded-md focus:outline-none focus:ring-2 ${
      disabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }`}
  >
    {children}
  </button>
);

export default Button;