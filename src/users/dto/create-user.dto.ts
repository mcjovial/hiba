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

  @IsArray()
  @IsOptional()
  roles: Role[];

  @IsString()
  @IsOptional()
  referrer?: User;

  @IsString()
  @IsOptional()
  position?: string;
}
