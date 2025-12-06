import { Clipboard } from "lucide-react";
import { useState } from "react";

const UserIdCopy = ({ userId }: { userId?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!userId) return;
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      <div className="text-center">
        <p className="text-gray-500 text-sm">User ID:</p>
        <p className="text-gray-800 font-medium">{userId}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={`p-2 rounded-md transition-colors ${
          copied ? "bg-blue-200 hover:bg-blue-300" : "bg-gray-200 hover:bg-gray-300"
        }`}
        title={copied ? "Copied!" : "Copy User ID"}
      >
        <Clipboard className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

export default UserIdCopy;
