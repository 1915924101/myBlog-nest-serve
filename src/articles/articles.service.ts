import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articlesRepository.create({
      ...createArticleDto,
      createTime: new Date(),
      status: 1,
    });
    return this.articlesRepository.save(article);
  }

  async findAll(query: any) {
    const { page = 1, size = 10, tag_id, class_id } = query;
    const skip = (page - 1) * size;
    const [result, total] = await this.articlesRepository.findAndCount({
      where: {
        ...(tag_id && { tagId: tag_id }),
        ...(class_id && { classId: class_id }),
      },
      order: { id: 'DESC' },
      skip,
      take: size,
    });
    return { data: result, total };
  }

  async findOne(id: number) {
    const article = await this.articlesRepository.findOneBy({ id });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return article;
  }

  async update(id: number, updateArticleDto: any) {
    const article = await this.articlesRepository.preload({
      id: id,
      ...updateArticleDto,
      updateTime: new Date(),
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return this.articlesRepository.save(article);
  }

  async remove(id: number) {
    const result = await this.articlesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('文章不存在');
    }
    return { message: '删除成功' };
  }

  // 增加文章浏览量
  async incrementViewCount(id: number) {
    const article = await this.findOne(id);
    article.viewCount += 1;
    return this.articlesRepository.save(article);
  }

  // 增加文章点赞数
  async incrementLikeCount(id: number) {
    const article = await this.findOne(id);
    article.likeCount += 1;
    return this.articlesRepository.save(article);
  }
}