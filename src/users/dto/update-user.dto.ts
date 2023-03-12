import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
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

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  planId?: string;

  @IsString()
  @IsOptional()
  plan?: Plan;
}
