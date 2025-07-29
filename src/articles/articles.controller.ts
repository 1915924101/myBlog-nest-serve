import { Controller, Post, Body, Get, Query, Put, Delete, NotFoundException, HttpCode, InternalServerErrorException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('add')
  @HttpCode(200) // 设置成功状态码为200
  async create(@Body() createArticleDto: CreateArticleDto) {
    try {
      const errors = await validate(plainToClass(CreateArticleDto, createArticleDto));
      if (errors.length > 0) {
        return { code: 1, status: 'error', message: '参数验证失败', data: errors };
      }
      
      await this.articlesService.create(createArticleDto);
      return { code: 0, status: 'success', message: '新增成功', data: null };
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('新增失败: ' + error.message);
    }
  }

  @Post('update')
  @HttpCode(200) // 设置成功状态码为200
  async update(@Body() body: any) {
    try {
      await this.articlesService.update(body.id, body);
      return { code: 0, status: 'success', message: '修改成功', data: null };
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('修改失败: ' + error.message);
    }
  }

  @Post('delete')
  @HttpCode(200) // 设置成功状态码为200
  async remove(@Body() body: { id: number }) {
    try {
      await this.articlesService.remove(body.id);
      return { code: 0, status: 'success', message: '删除成功', data: null };
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('删除失败: ' + error.message);
    }
  }

  @Post('list')
  @HttpCode(200) // 设置成功状态码为200
  async findAll(@Body() query: any) {
    try {
      const result = await this.articlesService.findAll(query);
      return { code: 0, status: 'success', message: '查询成功', data: result.data, total: result.total };
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('查询失败: ' + error.message);
    }
  }

  @Post('detail')
  @HttpCode(200) // 设置成功状态码为200
  async findOne(@Body() body: { id: number }) {
    try {
      const article = await this.articlesService.findOne(body.id);
      if (!article) {
        throw new NotFoundException('文章不存在');
      }
      return { code: 0, status: 'success', message: '查询成功', data: article };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // 当文章不存在时抛出NotFoundException
        throw error;
      } else {
        // 发生其他异常时返回500状态码
        throw new InternalServerErrorException('查询失败: ' + error.message);
      }
    }
  }

  // 增加文章浏览量
  @Post('view')
  @HttpCode(200) // 设置成功状态码为200
  async incrementViewCount(@Body() body: { id: number }) {
    try {
      await this.articlesService.incrementViewCount(body.id);
      return { code: 0, status: 'success', message: '浏览量增加成功', data: null };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // 当文章不存在时抛出NotFoundException
        throw error;
      } else {
        // 发生其他异常时返回500状态码
        throw new InternalServerErrorException('浏览量增加失败: ' + error.message);
      }
    }
  }

  // 增加文章点赞数
  @Post('like')
  @HttpCode(200) // 设置成功状态码为200
  async incrementLikeCount(@Body() body: { id: number }) {
    try {
      await this.articlesService.incrementLikeCount(body.id);
      return { code: 0, status: 'success', message: '点赞成功', data: null };
    } catch (error) {
      if (error instanceof NotFoundException) {
        // 当文章不存在时抛出NotFoundException
        throw error;
      } else {
        // 发生其他异常时返回500状态码
        throw new InternalServerErrorException('点赞失败: ' + error.message);
      }
    }
  }
}