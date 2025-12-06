"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorized = void 0;
const common_1 = require("@nestjs/common");
exports.Authorized = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const galleryRole = request.galleryRole;
    if (data === 'userId')
        return user?.userId;
    if (data === 'role')
        return galleryRole;
    return user;
});
//# sourceMappingURL=authorized.decorator.js.map