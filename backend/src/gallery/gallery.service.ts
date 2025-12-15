import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'prisma/__generated__';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const copyFile = promisify(fs.copyFile);
const access = promisify(fs.access);

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) { }
  async createGallery(dto: CreateGalleryDto, creatorId: string) {
    try {
      return await this.prisma.gallery.create({
        data: {
          ...dto,
          memberships: {
            create: {
              userId: creatorId,
              role: UserRole.OWNER,
            },
          },
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to create gallery');
    }
  }

  async getAllGalleries(userId: string, page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const galleries = await this.prisma.gallery.findMany({
        where: {
          memberships: {
            some: { userId },
          },
        },
        include: {
          memberships: {
            where: { userId },
            select: { role: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalCount = await this.prisma.gallery.count({
        where: {
          memberships: {
            some: { userId },
          },
        },
      });

      const formattedGalleries = galleries.map(gallery => {
        const role = gallery.memberships[0]?.role || null;
        const { memberships, ...galleryWithoutMemberships } = gallery;

        return {
          ...galleryWithoutMemberships,
          role,
        };
      });

      return {
        data: formattedGalleries,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch galleries');
    }
  }


  async getGalleryInfoById(id: string, userId: string) {
    try {
      const gallery = await this.prisma.gallery.findFirst({
        where: { id },
        include: {
          memberships: {
            where: { userId },
            select: { role: true },
          },
        },
      });

      if (!gallery) {
        throw new NotFoundException('Gallery not found');
      }

      const role = gallery.memberships[0]?.role || null;
      const { memberships, ...galleryWithoutMemberships } = gallery;

      return {
        ...galleryWithoutMemberships,
        role
      };
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch gallery');
    }
  }

  async updateGallery(galleryId: string, dto: UpdateGalleryDto) {

    try {
      return await this.prisma.gallery.update({
        where: { id: galleryId },
        data: { ...dto },
      });
    } catch {
      throw new InternalServerErrorException('Failed to update gallery');
    }
  }

  async deleteGallery(galleryId: string) {
  const galleryFolder = path.join(process.cwd(), 'uploads', galleryId);

  try {
    await this.prisma.$transaction(async (tx) => {

      await tx.gallery.delete({
        where: { id: galleryId },
      });

      try {
        if (fs.existsSync(galleryFolder)) {
          await fs.promises.rm(galleryFolder, {
            recursive: true,
            force: true,
          });
        }
      } catch (err) {
        throw new InternalServerErrorException(
          'Failed to delete gallery folder from disk',
        );
      }
    });
  } catch (err) {
    throw new InternalServerErrorException('Failed to delete gallery');
  }

  return { message: 'Gallery deleted successfully' };
}
}
