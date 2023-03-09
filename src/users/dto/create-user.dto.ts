import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../entities/user.entity';

export default class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsNumber()
  contact: number;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  referrer?: User;

  @IsString()
  position: string;
}
