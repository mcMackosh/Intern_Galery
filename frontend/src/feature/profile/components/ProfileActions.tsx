"use client";

import { Loader2 } from "lucide-react";
import { useLogoutMutation } from "@/feature/auth/hooks/useLogout";
import Button from "@/shared/ui/Buton";

const ProfileActions = () => {
  const logout = useLogoutMutation();

  return (
    <Button
      onClick={() => logout.logout()}
      disabled={logout.isPending}
      variant="danger"
      className="w-full px-5 py-3 flex justify-center items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      {logout.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      Logout
    </Button>
  );
};

export default ProfileActions;
