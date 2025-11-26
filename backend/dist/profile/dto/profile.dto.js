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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateProfileDto {
    firstName;
    lastName;
    email;
    password;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'First name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(50, { message: 'First name cannot be longer than 50 characters' }),
    (0, class_validator_1.Matches)(/^[A-Za-z]+$/, { message: 'First name cannot contain numbers or special characters' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Last name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Last name cannot be longer than 50 characters' }),
    (0, class_validator_1.Matches)(/^[A-Za-z]+$/, { message: 'Last name cannot contain numbers or special characters' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "password", void 0);
//# sourceMappingURL=profile.dto.js.map