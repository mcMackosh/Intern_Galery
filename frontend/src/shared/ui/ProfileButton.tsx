"use client";

import React from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProfileButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/profile");
  };

  return (
    <button
      onClick={handleClick}
      className="relative w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 mr-4"
    >
      <User className="w-6 h-6 text-gray-700" />
    </button>
  );
};
