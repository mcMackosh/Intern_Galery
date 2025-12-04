"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = class RedisService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async setRefreshToken(userId, token, ttl = 2 * 24 * 3600) {
        return await this.redis.set(`refresh:${userId}`, token, 'EX', ttl);
    }
    async getRefreshToken(userId) {
        return this.redis.get(`refresh:${userId}`);
    }
    async removeRefreshToken(userId) {
        return await this.redis.del(`refresh:${userId}`);
    }
    async logoutByToken(token) {
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
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisService);
//# sourceMappingURL=redis.service.js.map