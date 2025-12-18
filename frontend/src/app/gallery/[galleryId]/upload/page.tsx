import UploadImagesPage from "@/feature/image/components/upload/UploadImagesPage";
import { RoleGuard } from "@/shared/RolesGuard";
import { UserRole } from "@/types/membership";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Gallery",
};

const GalleryPage = () => {
  return (
    <RoleGuard roles={[UserRole.ADMIN, UserRole.OWNER]}>
      <UploadImagesPage />
    </RoleGuard>
  );
};

export default GalleryPage;
