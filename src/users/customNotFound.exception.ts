import { NotFoundException } from '@nestjs/common';

export class CustomNotFoundException extends NotFoundException {
  constructor(name: string, postId: number | string) {
    super(`${name} with id ${postId} not found`);
  }
}
