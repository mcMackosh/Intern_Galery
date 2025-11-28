import { User2 } from "lucide-react";

const ProfileAvatar = () => {
  return (
    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow">
      <User2 className="w-8 h-8 text-gray-500" />
    </div>
  );
};

export default ProfileAvatar;
