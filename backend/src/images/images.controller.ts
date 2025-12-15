import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  Body,
  Delete,
  Get,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import path from 'path';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from './extention.file';
import { IdsImagesDto } from './dto/ids-images.dto';

@Controller('galleries/:galleryId/image')
export class ImagesController {

  constructor(private readonly imagesService: ImagesService) { }

  @Post('/upload')
  @Authorization('ADMIN', 'OWNER')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype;
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        if (!ALLOWED_MIME_TYPES.includes(mime)) {
          return cb(new BadRequestException('Only image files are allowed (invalid MIME type)'), false);
        } 
        cb(null, true);
        
      },
      limits: {
        fileSize: 15 * 1024 * 1024,
      },
    }),
  )
  async uploadFiles(
    @Param('galleryId') galleryId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) throw new BadRequestException('No files provided');

    return this.imagesService.uploadImages(galleryId, files);
  }

  @Authorization('ADMIN', 'OWNER', 'REGULAR')
  @Get('')
  async getByGallery(
    @Param('galleryId') galleryId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {

    return this.imagesService.getImagesByGallery(galleryId, page, limit);
  }

  @Authorization('ADMIN', 'OWNER')
  @Delete()
  async deleteImages(@Body() body: IdsImagesDto, @Param('galleryId') galleryId: string) {
    if (!body?.ids || !Array.isArray(body.ids)) {
      throw new BadRequestException('ids array is required');
    }
    return this.imagesService.deleteImages(body.ids, galleryId);
  }

  @Authorization('ADMIN', 'OWNER')
  @Post('move/:targetGalleryId')
  async moveImages(
    @Body() body: IdsImagesDto,
    @Param('targetGalleryId') targetGalleryId: string,
    @Param('galleryId') galleryId: string) {
    if (!body?.ids || !Array.isArray(body.ids) || !targetGalleryId) {
      throw new BadRequestException('ids array and targetGalleryId are required');
    }
    console.log(galleryId, targetGalleryId, body)
    return this.imagesService.moveImages(body.ids, targetGalleryId, galleryId);
  }

  @Authorization('ADMIN', 'OWNER')
  @Post('copy/:targetGalleryId')
  async copyImages(@Body() body: IdsImagesDto,
    @Param('targetGalleryId') targetGalleryId: string,
    @Param('galleryId') galleryId: string) {
    if (!body?.ids || !Array.isArray(body.ids) || !targetGalleryId) {
      throw new BadRequestException('ids array and targetGalleryId are required');
    }
    return this.imagesService.copyImages(body.ids, targetGalleryId, galleryId);
  }
}