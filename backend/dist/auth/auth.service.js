"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("../profile/profile.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../redis/redis.service");
let AuthService = class AuthService {
    profileService;
    jwtService;
    configService;
    redisService;
    constructor(profileService, jwtService, configService, redisService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
    }
    async login(dto) {
        const existingUser = await this.profileService.findByEmail(dto.email);
        if (!existingUser || !existingUser.password) {
            throw new common_1.NotFoundException('User with this email does not exist. Please, register first or try another email.');
        }
        const isValidPassword = await bcrypt.compare(dto.password, existingUser.password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Password is incorrect. Please, try again or reset your password.');
        }
        const accessToken = await this.generateToken('ACCESS', existingUser.id);
        const refreshToken = await this.generateToken('REFRESH', existingUser.id);
        try {
            await this.redisService.setRefreshToken(existingUser.id, refreshToken);
        }
        catch {
            throw new common_1.InternalServerErrorException('Error while saving refresh token');
        }
        return { user: existingUser, accessToken, refreshToken };
    }
    async register(dto) {
        let newUser = await this.profileService.create(dto);
        const accessToken = await this.generateToken('ACCESS', newUser.id);
        const refreshToken = await this.generateToken('REFRESH', newUser.id);
        try {
            await this.redisService.setRefreshToken(newUser.id, refreshToken);
        }
        catch {
            throw new common_1.InternalServerErrorException('Error while saving token');
        }
        return { user: newUser, accessToken, refreshToken };
    }
    async generateToken(type, userId) {
        const payload = { userId };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: type === 'ACCESS' ? '10m' : '2d',
        });
    }
    async refreshTokens(token) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const saved = await this.redisService.getRefreshToken(payload.userId);
        if (!saved || saved !== token) {
            throw new common_1.InternalServerErrorException('Token mismatch');
        }
        const accessToken = await this.generateToken('ACCESS', payload.userId);
        const refreshToken = await this.generateToken('REFRESH', payload.userId);
        try {
            await this.redisService.setRefreshToken(payload.userId, refreshToken);
        }
        catch {
            throw new common_1.UnauthorizedException('Error while saving refresh token');
        }
        const newUser = await this.profileService.findById(payload.userId);
        return { user: newUser, accessToken, refreshToken };
    }
    async logout(userId) {
        let deleted = await this.redisService.removeRefreshToken(userId);
        if (deleted == 0) {
            throw new common_1.UnauthorizedException('Logout error');
        }
        return deleted;
    }
    async logoutByToken(token) {
        try {
            await this.redisService.logoutByToken(token);
        }
        catch {
            throw new common_1.InternalServerErrorException('Error while logout');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [profile_service_1.ProfileService,
        jwt_1.JwtService,
        config_1.ConfigService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map