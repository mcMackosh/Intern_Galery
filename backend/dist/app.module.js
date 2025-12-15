"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const is_dev_util_1 = require("./libs/common/utils/is-dev.util");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const profile_module_1 = require("./profile/profile.module");
const redis_module_1 = require("./redis/redis.module");
const galery_module_1 = require("./gallery/galery.module");
const membership_module_1 = require("./members/membership.module");
const images_module_1 = require("./images/images.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({
                isGlobal: true,
                ignoreEnvFile: !is_dev_util_1.IS_DEV_ENV,
            }), prisma_module_1.PrismaModule, auth_module_1.AuthModule, profile_module_1.ProfileModule, redis_module_1.RedisModule, galery_module_1.GalleryModule, membership_module_1.MembershipModule, images_module_1.ImagesModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map