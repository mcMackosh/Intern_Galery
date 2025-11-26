import Redis from 'ioredis';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    setRefreshToken(userId: string, token: string, ttl?: number): Promise<"OK">;
    getRefreshToken(userId: string): Promise<string | null>;
    removeRefreshToken(userId: string): Promise<number>;
    logoutByToken(token: string): Promise<boolean>;
}
