import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MembershipService],
  controllers: [MembershipController],
  imports: [AuthModule],
})
export class MembershipModule {}
