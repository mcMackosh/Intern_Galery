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
              role: UserRole.ADMIN,
            },
          },
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to create gallery');
    }
  }

  async getAllGalleries(userId: string) {
    try {
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
      });

      return galleries.map(gallery => {
        const role = gallery.memberships[0]?.role || null;
        const { memberships, ...galleryWithoutMemberships } = gallery;

        return {
          ...galleryWithoutMemberships,
          role,
        };
      });
    } catch {
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

    try {
      await this.prisma.gallery.delete({
        where: { id: galleryId },
      });
    } catch {
      throw new InternalServerErrorException('Failed to delete gallery');
    }

    return { message: 'Gallery deleted successfully' };
  }
}
