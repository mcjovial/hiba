import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomNotFoundException } from './customNotFound.exception';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PostgresErrorCode } from './postgresErrorCode.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto) {
    userData.role = 'customer';
    try {
      const newUser = this.userRepository.create(userData);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.log(error.detail);

      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers() {
    const [items, count] = await this.userRepository.findAndCount({});
    return {
      items,
      count,
    };
  }

  async updateUser(id: string, data: UpdateUserDto) {
    await this.userRepository.update(id, data);
    const updatedTask = await this.userRepository.find({
      where: { id },
      relations: ['plan'],
    });
    if (updatedTask) {
      return updatedTask;
    }
    throw new CustomNotFoundException('Task', id);
  }

  async deleteUser(id: string) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CustomNotFoundException('Task', id);
    }
  }
}
