import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Image } from 'prisma/__generated__';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { move } from 'fs-extra';

@Injectable()
export class ImagesService {
  private readonly UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {}

  private async ensureGalleryFolder(galleryId: string) {
    const folder = path.join(this.UPLOAD_ROOT, galleryId);
    await fs.promises.mkdir(folder, { recursive: true });
    return folder;
  }

  private toImageUrl(filePath: string) {
    return path.posix.join(...filePath.split(path.sep));
  }

  async uploadImages(galleryId: string, files: Express.Multer.File[]) {
    return this.prisma.$transaction(async tx => {
      const galleryFolder = await this.ensureGalleryFolder(galleryId);

      const createdImages: Image[] = [];

      for (const file of files) {
        const fileGuid = randomUUID();
        const filename = `${fileGuid}_${file.originalname}`;
        const relativePath = path.join(galleryId, filename);
        const fullPath = path.join(galleryFolder, filename);

        const image = await tx.image.create({
          data: {
            path: relativePath,
            originalFilename: file.originalname,
            galleryId,
          },
        });

        await fs.promises.writeFile(fullPath, file.buffer);
        createdImages.push(image);
      }

      return createdImages.map(img => ({
        ...img,
        path: this.toImageUrl(img.path),
      }));
    });
  }

  async deleteImages(ids: string[], galleryId: string) {
    return this.prisma.$transaction(async tx => {
      const images = await tx.image.findMany({
        where: {
          id: { in: ids },
          galleryId,
        },
      });

      if (images.length !== ids.length) {
        throw new ForbiddenException(
          'Some images do not belong to this gallery',
        );
      }

      await tx.image.deleteMany({
        where: { id: { in: ids } },
      });

      for (const img of images) {
        const fullPath = path.join(this.UPLOAD_ROOT, img.path);
        await fs.promises.unlink(fullPath);
      }

      return { deleted: ids };
    });
  }

  async getImagesByGallery(
    galleryId: string,
    page = 1,
    limit = 20,
    order: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.image.findMany({
        where: { galleryId },
        orderBy: { createdAt: order },
        skip,
        take: limit,
      }),
      this.prisma.image.count({ where: { galleryId } }),
    ]);

    const mapped = items.map(item => ({
      ...item,
      path: this.toImageUrl(item.path),
    }));

    const grouped = mapped.reduce((acc, item) => {
      const key = item.createdAt.toISOString().split('T')[0];
      acc[key] ??= [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, typeof mapped[number][]>);

    return {
      items: grouped,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async moveImages(
    ids: string[],
    targetGalleryId: string,
    galleryId: string,
  ) {
    return this.prisma.$transaction(async tx => {
      const images = await tx.image.findMany({
        where: { id: { in: ids }, galleryId },
      });

      if (images.length !== ids.length) {
        throw new ForbiddenException('Some images do not belong to this gallery');
      }

      await this.ensureGalleryFolder(targetGalleryId);

      const updated: Image[] = [];

      for (const img of images) {
        const filename = path.basename(img.path);
        const src = path.join(this.UPLOAD_ROOT, img.path);
        const destRel = path.join(targetGalleryId, filename);
        const dest = path.join(this.UPLOAD_ROOT, destRel);

        await move(src, dest, { overwrite: true });

        const updatedImg = await tx.image.update({
          where: { id: img.id },
          data: {
            galleryId: targetGalleryId,
            path: destRel,
          },
        });

        updated.push(updatedImg);
      }

      return updated.map(img => ({
        ...img,
        path: this.toImageUrl(img.path),
      }));
    });
  }

  async copyImages(
    ids: string[],
    targetGalleryId: string,
    galleryId: string,
  ) {
    return this.prisma.$transaction(async tx => {
      const images = await tx.image.findMany({
        where: { id: { in: ids }, galleryId },
      });

      if (images.length !== ids.length) {
        throw new ForbiddenException('Some images do not belong to this gallery');
      }

      await this.ensureGalleryFolder(targetGalleryId);

      const created: Image[] = [];

      for (const img of images) {
        const fileGuid = randomUUID();
        const filename = `${fileGuid}_${img.originalFilename}`;
        const src = path.join(this.UPLOAD_ROOT, img.path);
        const destRel = path.join(targetGalleryId, filename);
        const dest = path.join(this.UPLOAD_ROOT, destRel);

        await fs.promises.copyFile(src, dest);

        const newImage = await tx.image.create({
          data: {
            path: destRel,
            originalFilename: img.originalFilename,
            galleryId: targetGalleryId,
          },
        });

        created.push(newImage);
      }

      return created.map(img => ({
        ...img,
        path: this.toImageUrl(img.path),
      }));
    });
  }
}