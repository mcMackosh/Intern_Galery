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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const authorized_decorator_1 = require("./decorators/authorized.decorator");
const auth_guard_1 = require("./guard/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const cookie_helper_1 = require("./cookie.helper");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto, res) {
        const { accessToken, refreshToken } = await this.authService.register(dto);
        (0, cookie_helper_1.setRefreshTokenCookie)(res, refreshToken);
        return { accessToken };
    }
    async login(dto, res) {
        const { accessToken, refreshToken } = await this.authService.login(dto);
        (0, cookie_helper_1.setRefreshTokenCookie)(res, refreshToken);
        return { accessToken };
    }
    async logout(userId, res) {
        const info = await this.authService.logout(userId);
        if (info)
            (0, cookie_helper_1.clearRefreshTokenCookie)(res);
    }
    async refresh(req, res) {
        const refreshToken = (0, cookie_helper_1.getRefreshTokenFromRequest)(req);
        try {
            const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(refreshToken);
            if (newRefreshToken)
                (0, cookie_helper_1.setRefreshTokenCookie)(res, newRefreshToken);
            return { accessToken };
        }
        catch (err) {
            await this.authService.logoutByToken(refreshToken);
            (0, cookie_helper_1.clearRefreshTokenCookie)(res);
            throw new common_1.UnauthorizedException(err.message);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully registered', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged in', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user and clear refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged out' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, authorized_decorator_1.Authorized)('userId')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'New access token generated', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Refresh token expired or invalid' }),
    (0, swagger_1.ApiCookieAuth)('refresh_token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map