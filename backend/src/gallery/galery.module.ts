import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService],
  imports: [AuthModule, RedisModule]
})
export class GalleryModule {}
