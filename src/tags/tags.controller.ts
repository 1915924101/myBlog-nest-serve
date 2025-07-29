import { Controller, Post, Body, Get, Query, Put, Delete, HttpCode, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('tag')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('add')
  @HttpCode(200) // 设置成功状态码为200
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      const errors = await validate(plainToClass(CreateTagDto, createTagDto));
      if (errors.length > 0) {
        return { code: 1, status: 'error', message: '参数验证失败', data: errors };
      }
      
      await this.tagsService.create(createTagDto);
      return { code: 0, status: 'success', message: '新增成功', data: null };
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('新增失败: ' + error.message);
    }
  }

  @Get('list')
  @HttpCode(200) // 设置成功状态码为200
  async findAll() {
    try {
      const tags = await this.tagsService.findAll();
      // 将name和id格式转换为label和value格式
      const formattedTags = tags.map(tag => ({
        label: tag.name,
        value: tag.id
      }));
      return { code: 0, status: 'success', message: '查询成功', data: formattedTags };
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('查询失败: ' + error.message);
    }
  }

  @Post('update')
  @HttpCode(200) // 设置成功状态码为200
  async update(@Body() body: { id: number; name: string }) {
    try {
      // 检查标签是否存在
      const tag = await this.tagsService.findOne(body.id);
      if (!tag) {
        throw new NotFoundException('标签不存在');
      }
      
      await this.tagsService.update(body.id, { name: body.name });
      return { code: 0, status: 'success', message: '修改成功', data: null };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // 当标签不存在时抛出NotFoundException
        throw error;
      } else {
        // 发生其他异常时返回500状态码
        throw new InternalServerErrorException('修改失败: ' + error.message);
      }
    }
  }

  @Post('delete')
  @HttpCode(200) // 设置成功状态码为200
  async remove(@Body() body: { id: number }) {
    try {
      // 检查标签是否存在
      const tag = await this.tagsService.findOne(body.id);
      if (!tag) {
        throw new NotFoundException('标签不存在');
      }
      
      await this.tagsService.remove(body.id);
      return { code: 0, status: 'success', message: '删除成功', data: null };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // 当标签不存在时抛出NotFoundException
        throw error;
      } else {
        // 发生其他异常时返回500状态码
        throw new InternalServerErrorException('删除失败: ' + error.message);
      }
    }
  }
}