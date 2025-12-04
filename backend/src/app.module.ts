import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { RedisModule } from './redis/redis.module';
import { GalleryModule } from './galery/galery.module';
import { MembershipModule } from './members/membership.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
  }), PrismaModule, AuthModule, ProfileModule, RedisModule, GalleryModule, MembershipModule],
})
export class AppModule {}

