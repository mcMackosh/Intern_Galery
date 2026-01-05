import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetGalleriesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'title';

  @IsOptional()
  @IsString()
  orderBy?: 'asc' | 'desc';

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minImages?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxImages?: number;
}
