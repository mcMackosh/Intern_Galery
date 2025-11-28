"use client";

import { Loader2 } from "lucide-react";
import { useLogoutMutation } from "@/feature/auth/hooks/useLogout";

const ProfileActions = () => {
  const logout = useLogoutMutation();

  return (
    <button
      onClick={() => logout.logout()}
      disabled={logout.isPending}
      className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex justify-center items-center gap-2"
    >
      {logout.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      Logout
    </button>
  );
};

export default ProfileActions;
