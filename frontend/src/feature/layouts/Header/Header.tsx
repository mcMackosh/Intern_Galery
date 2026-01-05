"use client";

import { ProfileButton } from "@/feature/profile/components/ProfileButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Header = () => {
  const nav = useRouter();
  return (
    <header className="w-full bg-blue-700 shadow-lg fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center py-4 px-4">
        <Link
          href="/gallery"
          className="text-2xl font-bold text-white cursor-pointer"
        >
          Gallery
        </Link>
        <ProfileButton />
      </div>
    </header>
  );
};