import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Position, User } from 'src/users/entities/user.entity';

export class CreateBvLogDto {
  @IsString()
  user: User;
  @IsEnum(Position)
  position: string;
  @IsNumber()
  amount: number;
  @IsString()
  details: string;
}
