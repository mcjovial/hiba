import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export default class UpdateUserDto {
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
  referrer: string;

  @IsString()
  position: string;
}
