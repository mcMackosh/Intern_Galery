import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, UserRole } from 'prisma/__generated__';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { GetGalleriesQueryDto } from './dto/gallery.search.options';
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

  async getAllGalleries(
    userId: string, page: number,
    limit: number, query: GetGalleriesQueryDto,
  ) {
    try {
      const {
        search, 
        sortBy = 'createdAt', sortOrder = 'desc',
        startDate, endDate,
        minImages, maxImages,
      } = query;

      const skip = (page - 1) * limit;

      const where: Prisma.GalleryWhereInput = {
        memberships: {
          some: { userId },
        },
      };

      if (search) {
        where.title = {
          contains: search,
          mode: 'insensitive',
        };
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const galleries = await this.prisma.gallery.findMany({
        where,
        include: {
          memberships: {
            where: { userId },
            select: { role: true },
          },
          _count: {
            select: { images: true },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      const filteredGalleries = galleries.filter(gallery => {
        const count = gallery._count.images;

        if (minImages !== undefined && count < minImages) return false;
        if (maxImages !== undefined && count > maxImages) return false;

        return true;
      });

      const paginatedGalleries = filteredGalleries.slice(skip, skip + limit);

      const formattedGalleries = paginatedGalleries.map(gallery => {
        const role = gallery.memberships[0]?.role || null;
        const { memberships, _count, ...rest } = gallery;

        return {
          ...rest,
          role,
          imagesCount: _count.images,
        };
      });

      return {
        data: formattedGalleries,
        meta: {
          total: filteredGalleries.length,
          page,
          limit,
          totalPages: Math.ceil(filteredGalleries.length / limit),
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
