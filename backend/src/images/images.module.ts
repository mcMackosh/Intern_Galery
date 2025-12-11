import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, PrismaService],
  exports: [ImagesService],
  imports: [AuthModule]
})
export class ImagesModule {}