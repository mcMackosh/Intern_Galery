import { IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @Length(3, 50)
  title: string;

  @ValidateIf((_, value) => value !== "" && value !== undefined)
  @IsString()
  @Length(3, 50, {
    message: "Description must be between 10 and 255 characters",
  })
  description?: string;
}
