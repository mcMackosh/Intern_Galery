import { FunctionComponent } from "react";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";

const ProfileMenu: FunctionComponent = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white border rounded-2xl shadow-lg space-y-6">
      <div className="flex items-center gap-4">
        <ProfileAvatar />
        <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
      </div>

      <ProfileForm />
      <ProfileActions />
    </div>
  );
};

export default ProfileMenu;