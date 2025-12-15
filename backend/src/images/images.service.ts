import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Image } from 'prisma/__generated__';
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const copyFile = promisify(fs.copyFile);
const access = promisify(fs.access);
import { move } from 'fs-extra';
import { randomUUID } from 'crypto';

@Injectable()
export class ImagesService {
  private UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) { }

  private async ensureGalleryFolder(galleryId: string) {
    const folder = path.join(this.UPLOAD_ROOT, galleryId);
    try {
      await access(folder);
    } catch (e) {
      await mkdir(folder, { recursive: true });
    }
    return folder;
  }

  async uploadImages(galleryId: string, files: Express.Multer.File[]) {
    return this.prisma.$transaction(async (tx) => {
      const galleryFolder = await this.ensureGalleryFolder(galleryId);

      const uploadPromises = files.map(async (file) => {
        const fileGuid = randomUUID();
        const relativePath = path.join(galleryId, `${fileGuid}_${file.originalname}`);

        let image: Image;
        try {
          image = await tx.image.create({
            data: {
              path: relativePath,
              originalFilename: file.originalname,
              galleryId,
            },
          });
        } catch (err) {
          throw new InternalServerErrorException(`Failed to save file: ${file.originalname}`);
        }

        const fullFilePath = path.join(galleryFolder, `${fileGuid}_${file.originalname}`);
        try {
          await fs.promises.writeFile(fullFilePath, file.buffer);
        } catch (err) {
          throw new InternalServerErrorException(`Failed to save file: ${file.originalname} to disk`);
        }

        return image;
      });

      const createdImages = await Promise.all(uploadPromises);

      return createdImages;
    });
  }

  async deleteImages(ids: string[], galleryId: string) {
    return this.prisma.$transaction(async (tx) => {

      const images = await tx.image.findMany({
        where: {
          id: { in: ids },
          galleryId,
        },
      });

      if (images.length !== ids.length) {
        throw new ForbiddenException(
          'Some images do not belong to this gallery'
        );
      }

      await tx.image.deleteMany({
        where: {
          id: { in: ids }
        },
      });

      for (const img of images) {
        const fullPath = path.join(this.UPLOAD_ROOT, img.path);
        try {
          await unlink(fullPath);
        } catch (err) {
          throw new InternalServerErrorException(`Failed to delete file: ${img.originalFilename}`);
        }
      }

      return { deleted: ids };
    });
  }


  async getImagesByGallery(galleryId: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        this.prisma.image.findMany({
          where: { galleryId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.image.count({ where: { galleryId } }),
      ]);

      return {
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Problem with get image');
    }
  }

  async moveImages(ids: string[], targetGalleryId: string, galleryId: string) {
    return this.prisma.$transaction(async (tx) => {

      let images: Image[]
      try {
        images = await tx.image.findMany({
          where: { id: { in: ids }, galleryId },
        });
      } catch {
        throw new InternalServerErrorException(
          `Cannot move file`
        );
      }

      await this.ensureGalleryFolder(targetGalleryId);

      const updated: Image[] = [];

      for (const img of images) {
        const src = path.join(this.UPLOAD_ROOT, img.path);
        const filename = path.basename(img.path);
        const destRel = path.join(targetGalleryId, filename);
        const dest = path.join(this.UPLOAD_ROOT, destRel);

        try {
          await move(src, dest, { overwrite: true });
        } catch {
          throw new InternalServerErrorException(
            `Cannot move file from ${src} to ${dest}`
          );
        }
        let updatedImg: Image
        try {
          updatedImg = await tx.image.update({
            where: { id: img.id },
            data: { galleryId: targetGalleryId, path: destRel },
          });
        } catch {
          throw new InternalServerErrorException(
            `Cannot move file from ${src} to ${dest}`
          );
        }


        updated.push(updatedImg);
      }

      return updated;
    });
  }

  async copyImages(ids: string[], targetGalleryId: string, galleryId: string) {
    return this.prisma.$transaction(async (tx) => {
      const images = await tx.image.findMany({
        where: { id: { in: ids }, galleryId },
      });

      await this.ensureGalleryFolder(targetGalleryId);

      const created: Image[] = [];

      for (const img of images) {
        const src = path.join(this.UPLOAD_ROOT, img.path);
        const fileGuid = randomUUID();
        const destRel = path.join(targetGalleryId, `${fileGuid}_${img.originalFilename}`);
        const dest = path.join(this.UPLOAD_ROOT, destRel);

        try {
          await copyFile(src, dest);
        } catch (err) {
          throw new InternalServerErrorException(
            `Cannot copy file from ${src} to ${dest}: ${err.message}`
          );
        }

        const newImage = await tx.image.create({
          data: {
            path: destRel,
            originalFilename: img.originalFilename,
            galleryId: targetGalleryId,
          },
        });

        created.push(newImage);
      }

      return created;
    });
  }
}