import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete, Query } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  @Authorization('ADMIN', 'OWNER', 'REGULAR')
  @Get('/:galleryId')
  async getGallery(
    @Param('galleryId') galleryId: string,
    @Authorized('userId') userId: string
  ) {
    const gallery = await this.galleryService.getGalleryInfoById(galleryId, userId);
    return gallery;
  }

  @Authorization()
  @Post()
  async createGallery(
    @Authorized('userId') userId: string,
    @Body() dto: CreateGalleryDto
  ) {
    const gallery = await this.galleryService.createGallery(dto, userId);
    return gallery;
  }

  @Authorization()
  @Get()
  async getAllGaleries(
    @Authorized('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    const galeries = await this.galleryService.getAllGalleries(userId, page, limit);
    return galeries;
  }

  @Authorization('ADMIN', 'OWNER')
  @Put(':galleryId')
  async updateGallery(
    @Param('galleryId') galleryId: string,
    @Body() dto: UpdateGalleryDto
  ) {

    const gallery = await this.galleryService.updateGallery(galleryId, dto);
    return gallery;
  }

  @Authorization('OWNER')
  @Delete(':galleryId')
  async deleteGallery(
    @Param('galleryId') galleryId: string
  ) {
    await this.galleryService.deleteGallery(galleryId);
    return true;
  }
}
