import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const existingTag = await this.tagsRepository.findOneBy({ name: createTagDto.name });
    if (existingTag) {
      throw new ConflictException('标签已存在');
    }
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  async findAll() {
    return this.tagsRepository.find();
  }

  async findOne(id: number) {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('标签不存在');
    }
    return tag;
  }

  async update(id: number, updateTagDto: { name: string }) {
    const existingTag = await this.tagsRepository.findOneBy({ name: updateTagDto.name });
    if (existingTag && existingTag.id !== id) {
      throw new ConflictException('标签名称已存在');
    }
    const tag = await this.tagsRepository.preload({
      id,
      ...updateTagDto,
    });
    if (!tag) {
      throw new NotFoundException('标签不存在');
    }
    return this.tagsRepository.save(tag);
  }

  async remove(id: number) {
    const result = await this.tagsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('标签不存在');
    }
    return { message: '删除成功' };
  }
}