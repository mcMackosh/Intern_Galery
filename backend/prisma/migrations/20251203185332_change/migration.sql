/*
  Warnings:

  - The values [OWNER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `gallery_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `gallery_members` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('REGULAR', 'ADMIN');
ALTER TABLE "public"."gallery_members" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "gallery_members" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "gallery_members" ALTER COLUMN "role" SET DEFAULT 'REGULAR';
COMMIT;

-- AlterTable
ALTER TABLE "gallery_members" DROP CONSTRAINT "gallery_members_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "gallery_members_pkey" PRIMARY KEY ("gallery_id", "user_id");
