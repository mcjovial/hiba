import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Position, User } from 'src/users/entities/user.entity';

export class CreateBvLogDto {
  @IsString()
  user: User;
  @IsEnum(Position)
  position: Position;
  @IsNumber()
  amount: number;
  @IsString()
  trxType: string;
  @IsString()
  details: string;
}
