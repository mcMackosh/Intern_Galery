import { User } from "lucide-react";
import Link from "next/link";

export const ProfileButton = () => {
  return (
    <Link
      href="/profile"
      className="relative w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 mr-4"
    >
      <User className="w-6 h-6 text-gray-700" />
    </Link>
  );
};