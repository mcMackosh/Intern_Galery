-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('REGULAR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "gallery_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'REGULAR',

    CONSTRAINT "gallery_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "gallery_members" ADD CONSTRAINT "gallery_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_members" ADD CONSTRAINT "gallery_members_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
