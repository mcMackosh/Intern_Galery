import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { Is } from 'sequelize-typescript';

export class ProfileDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
  @Matches(/^[A-Za-z]+$/, { message: 'First name cannot contain numbers or special characters' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
  @Matches(/^[A-Za-z]+$/, { message: 'Last name cannot contain numbers or special characters' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}

export class ResetPasswordDto {
  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  newPassword: string;
} 