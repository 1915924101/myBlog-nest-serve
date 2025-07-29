import { Controller, Post, Body, Get, Query, Put, Delete } from '@nestjs/common';
import { ClassifiesService } from './classifies.service';
import { CreateClassifyDto } from './dto/create-classify.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('classify')
export class ClassifiesController {
  constructor(private readonly classifiesService: ClassifiesService) {}

  @Post('add')
  async create(@Body() createClassifyDto: CreateClassifyDto) {
    const errors = await validate(plainToClass(CreateClassifyDto, createClassifyDto));
    if (errors.length > 0) {
      return { code: 1, status: 'error', message: '参数验证失败', data: errors };
    }
    try {
      await this.classifiesService.create(createClassifyDto);
      return { code: 0, status: 'success', message: '新增成功', data: null };
    } catch (error) {
      return { code: 1, status: 'error', message: '新增失败: ' + error.message, data: null };
    }
  }

  @Get('list')
  async findAll() {
    try {
      const classifies = await this.classifiesService.findAll();
      // 将name和id格式转换为label和value格式
      const formattedClassifies = classifies.map(classify => ({
        label: classify.name,
        value: classify.id
      }));
      return { code: 0, status: 'success', message: '查询成功', data: formattedClassifies };
    } catch (error) {
      return { code: 1, status: 'error', message: '查询失败: ' + error.message, data: null };
    }
  }

  @Post('update')
  async update(@Body() body: { id: number; name: string }) {
    try {
      await this.classifiesService.update(body.id, { name: body.name });
      return { code: 0, status: 'success', message: '修改成功', data: null };
    } catch (error) {
      return { code: 1, status: 'error', message: '修改失败: ' + error.message, data: null };
    }
  }

  @Post('delete')
  async remove(@Body() body: { id: number }) {
    try {
      await this.classifiesService.remove(body.id);
      return { code: 0, status: 'success', message: '删除成功', data: null };
    } catch (error) {
      return { code: 1, status: 'error', message: '删除失败: ' + error.message, data: null };
    }
  }
}