import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BvLogsService } from './bv-logs.service';
import { CreateBvLogDto } from './dto/create-bv-log.dto';
import { UpdateBvLogDto } from './dto/update-bv-log.dto';

@Controller('bv-logs')
export class BvLogsController {
  constructor(private readonly bvLogsService: BvLogsService) {}

  @Post()
  create(@Body() createBvLogDto: CreateBvLogDto) {
    return this.bvLogsService.create(createBvLogDto);
  }

  @Get()
  findAll() {
    return this.bvLogsService.findAll();
  }

  @Post('user')
  findUserBvLogs(@Body() body: any) {
    return this.bvLogsService.findUserBvLogs(body.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bvLogsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBvLogDto: UpdateBvLogDto) {
    return this.bvLogsService.update(id, updateBvLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bvLogsService.remove(id);
  }
}
