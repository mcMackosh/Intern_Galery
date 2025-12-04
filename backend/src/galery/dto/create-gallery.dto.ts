import { IsString, Length } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(3, 50)
  description?: string;
}
