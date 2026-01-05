"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDateRange = void 0;
const common_1 = require("@nestjs/common");
const validateDateRange = (dateFrom, dateTo) => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
        throw new common_1.BadRequestException('Start date cannot be greater than end date');
    }
};
exports.validateDateRange = validateDateRange;
//# sourceMappingURL=validate.date.js.map