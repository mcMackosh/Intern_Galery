import { IsString, Length } from 'class-validator';

export class UpdateGalleryDto {
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(3, 50)
  description?: string;
}
