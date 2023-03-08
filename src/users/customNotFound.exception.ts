import { NotFoundException } from '@nestjs/common';

export class CustomNotFoundException extends NotFoundException {
  constructor(name: string, id?: number | string) {
    super(`${name} ${id ? `with id ${id} ` : ''}not found`);
  }
}
