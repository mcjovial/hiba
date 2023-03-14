import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/common/enums';
import { Plan } from 'src/plans/entities/plan.entity';
import { User } from '../entities/user.entity';

export default class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @Length(6, 20)
  password?: string;

  @IsNumber()
  @IsOptional()
  contact?: number;

  @IsArray()
  @IsOptional()
  roles: Role[];

  @IsString()
  @IsOptional()
  planId?: string;

  @IsString()
  @IsOptional()
  plan?: Plan;
}
