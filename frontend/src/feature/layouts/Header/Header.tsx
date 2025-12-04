"use client";

import { ProfileButton } from "@/shared/ui/ProfileButton";
import { useRouter } from "next/navigation";

export const Header = () => {
  const nav = useRouter();
  return (
    <header className="w-full bg-blue-700 shadow-lg fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center py-4 px-4">
        <a className="text-2xl font-bold text-white cursor-pointer" onClick={() => nav.push('/')}>Gallery</a>
        <ProfileButton />
      </div>
    </header>
  );
};