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

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}
  
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
    query: GetGalleriesQueryDto,
  ) {
    const {
      search,
      sortBy,
      orderBy,
      startDate,
      endDate,
      minImages,
      maxImages,
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
      orderBy: {
        [sortBy as string]: orderBy,
      },
      include: {
        memberships: {
          where: { userId },
          select: { role: true },
        },
        _count: {
          select: { images: true },
        },
      },
    });

    const filtered = galleries.filter(g => {
      const count = g._count.images;
      if (minImages !== undefined && count < minImages) return false;
      if (maxImages !== undefined && count > maxImages) return false;
      return true;
    });

    const paginated = filtered.slice(skip, skip + limit);

    return {
      data: paginated.map(g => ({
        id: g.id,
        title: g.title,
        createdAt: g.createdAt,
        role: g.memberships[0]?.role ?? null,
        imagesCount: g._count.images,
      })),
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
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
