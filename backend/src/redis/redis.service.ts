import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) { }

  async setRefreshToken(userId: string, token: string, ttl = 7 * 24 * 3600) {
    return await this.redis.set(`refresh:${userId}`, token, 'EX', ttl);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.redis.get(`refresh:${userId}`);
  }

  async removeRefreshToken(userId: string) {
    return await this.redis.del(`refresh:${userId}`);
  }

  async logoutByToken(token: string) {
    const keys = await this.redis.keys('refresh:*');
    for (const key of keys) {
      const t = await this.redis.get(key);
      if (t === token) {
        await this.redis.del(key);
        return true;
      }
    }
    return false;
  }
}
