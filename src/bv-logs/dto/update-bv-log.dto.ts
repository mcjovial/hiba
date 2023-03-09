import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateBvLogDto } from './create-bv-log.dto';

export class UpdateBvLogDto extends PartialType(CreateBvLogDto) {
  @IsString()
  @IsOptional()
  id: string;
}
