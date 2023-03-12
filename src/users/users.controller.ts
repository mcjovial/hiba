import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { TransformResponseInterceptor } from './transform-response.interceptor';
import { FindOneParams } from './types/find-one-params';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(TransformResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async register(@Body() registerationData: CreateUserDto) {
    const result = await this.usersService.create(registerationData);
    return { message: 'User Created Successfully', result };
  }

  @Get()
  async getUsers() {
    const result = await this.usersService.getAllUsers();
    return { message: '', result };
  }

  @Put(':id')
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    return this.usersService.deleteUser(id);
  }
}
