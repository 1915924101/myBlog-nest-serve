import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classify } from '../classify/entities/classify.entity';
import { CreateClassifyDto } from './dto/create-classify.dto';

@Injectable()
export class ClassifiesService {
  constructor(
    @InjectRepository(Classify)
    private classifiesRepository: Repository<Classify>,
  ) {}

  async create(createClassifyDto: CreateClassifyDto) {
    const existingClassify = await this.classifiesRepository.findOneBy({ name: createClassifyDto.name });
    if (existingClassify) {
      throw new ConflictException('分类已存在');
    }
    const classify = this.classifiesRepository.create(createClassifyDto);
    return this.classifiesRepository.save(classify);
  }

  async findAll() {
    return this.classifiesRepository.find();
  }

  async findOne(id: number) {
    const classify = await this.classifiesRepository.findOneBy({ id });
    if (!classify) {
      throw new NotFoundException('分类不存在');
    }
    return classify;
  }

  async update(id: number, updateClassifyDto: { name: string }) {
    const existingClassify = await this.classifiesRepository.findOneBy({ name: updateClassifyDto.name });
    if (existingClassify && existingClassify.id !== id) {
      throw new ConflictException('分类名称已存在');
    }
    const classify = await this.classifiesRepository.preload({
      id,
      ...updateClassifyDto,
    });
    if (!classify) {
      throw new NotFoundException('分类不存在');
    }
    return this.classifiesRepository.save(classify);
  }

  async remove(id: number) {
    const result = await this.classifiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('分类不存在');
    }
    return { message: '删除成功' };
  }
}