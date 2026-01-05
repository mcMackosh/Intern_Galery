import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, UserRole } from 'prisma/__generated__';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GetGalleriesQueryDto } from './dto/gallery.search.options';
import * as fs from 'fs';
import * as path from 'path';
import { validateDateRange } from 'src/libs/common/validate.date';
import Fuse from 'fuse.js';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) { }

  async createGallery(dto: CreateGalleryDto, creatorId: string) {
    return this.prisma.gallery.create({
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
  }

  async getAllGalleries(
    userId: string,
    page: number,
    limit: number,
    query: GetGalleriesQueryDto
  ) {
    const { search, sortBy, orderBy, startDate, endDate, minImages, maxImages } = query;
    validateDateRange(startDate, endDate);

    const skip = (page - 1) * limit;
    const where: any = {
      memberships: {
        some: { userId: userId }
      }
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive' as const
      };
    }
    const sortFieldMap = {
      createdAt: 'createdAt',
      title: 'title'
    };

    const orderByField = sortFieldMap[sortBy || 'createdAt'] || 'createdAt';
    const orderDirection = orderBy || 'desc';

    const [total, galleries] = await Promise.all([
      this.prisma.gallery.count({ where }),
      this.prisma.gallery.findMany({
        where,
        include: {
          memberships: {
            where: { userId: userId },
            select: { role: true }
          },
          images: {
            take: 4,
            orderBy: { createdAt: 'asc' },
            select: { path: true }
          },
          _count: {
            select: { images: true }
          }
        },
        orderBy: {
          [orderByField]: orderDirection
        },
        skip,
        take: limit
      })
    ]);

    let filteredGalleries = galleries;

    if (minImages !== undefined || maxImages !== undefined) {
      filteredGalleries = galleries.filter(gallery => {
        const count = gallery._count.images;
        if (minImages !== undefined && count < minImages) return false;
        if (maxImages !== undefined && count > maxImages) return false;
        return true;
      });
    }

    const finalTotal = minImages !== undefined || maxImages !== undefined
      ? filteredGalleries.length
      : total;

    const data = filteredGalleries.map(gallery => ({
      id: gallery.id,
      title: gallery.title,
      createdAt: gallery.createdAt,
      role: gallery.memberships[0]?.role || null,
      imagesCount: gallery._count.images,
      images: gallery.images.map(img => img.path)
    }));

    return {
      data,
      meta: {
        total: finalTotal,
        page,
        limit,
        totalPages: Math.ceil(finalTotal / limit)
      }
    };
  }


  async getGalleryInfoById(id: string, userId: string) {
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

    return {
      id: gallery.id,
      title: gallery.title,
      createdAt: gallery.createdAt,
      role: gallery.memberships[0]?.role ?? null,
    };
  }

  async updateGallery(galleryId: string, dto: UpdateGalleryDto) {
    return this.prisma.gallery.update({
      where: { id: galleryId },
      data: dto,
    });
  }

  async deleteGallery(galleryId: string) {
    const galleryFolder = path.join(process.cwd(), 'uploads', galleryId);

    await this.prisma.$transaction(async tx => {
      await tx.gallery.delete({
        where: { id: galleryId },
      });

      if (fs.existsSync(galleryFolder)) {
        await fs.promises.rm(galleryFolder, {
          recursive: true,
          force: true,
        });
      }
    });

    return { message: 'Gallery deleted successfully' };
  }
}