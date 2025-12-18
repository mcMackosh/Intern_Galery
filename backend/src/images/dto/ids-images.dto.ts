import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class IdsImagesDto {
  @IsArray()
  @ArrayNotEmpty()
  // @IsUUID()
  ids: string[];
}