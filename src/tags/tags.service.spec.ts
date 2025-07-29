import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';

describe('TagsService', () => {
  let service: TagsService;
  let repository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    repository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  describe('create', () => {
    it('should create a new tag successfully', async () => {
      // Arrange
      const createTagDto: CreateTagDto = { name: 'Test Tag' };
      const tag = { id: 1, ...createTagDto };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(tag as Tag);
      jest.spyOn(repository, 'save').mockResolvedValue(tag as Tag);

      // Act
      const result = await service.create(createTagDto);

      // Assert
      expect(result).toEqual(tag);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Test Tag' });
      expect(repository.create).toHaveBeenCalledWith(createTagDto);
      expect(repository.save).toHaveBeenCalledWith(tag);
    });

    it('should throw ConflictException if tag already exists', async () => {
      // Arrange
      const createTagDto: CreateTagDto = { name: 'Existing Tag' };
      const existingTag = { id: 1, ...createTagDto };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingTag as Tag);

      // Act & Assert
      await expect(service.create(createTagDto)).rejects.toThrow(ConflictException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Existing Tag' });
    });
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      // Arrange
      const tags = [
        { id: 1, name: 'Tag 1' },
        { id: 2, name: 'Tag 2' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(tags as Tag[]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(tags);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      // Arrange
      const tag = { id: 1, name: 'Test Tag' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(tag as Tag);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(tag);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if tag not found', async () => {
      // Arrange
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('update', () => {
    it('should update an existing tag', async () => {
      // Arrange
      const updateData = { name: 'Updated Tag' };
      const tag = { id: 1, name: 'Original Tag' };
      const updatedTag = { id: 1, ...updateData };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'preload').mockResolvedValue(updatedTag as Tag);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTag as Tag);

      // Act
      const result = await service.update(1, updateData);

      // Assert
      expect(result).toEqual(updatedTag);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Updated Tag' });
      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateData,
      });
      expect(repository.save).toHaveBeenCalledWith(updatedTag);
    });

    it('should throw ConflictException if tag name already exists', async () => {
      // Arrange
      const updateData = { name: 'Existing Tag' };
      const existingTag = { id: 2, ...updateData };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingTag as Tag);

      // Act & Assert
      await expect(service.update(1, updateData)).rejects.toThrow(ConflictException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Existing Tag' });
    });

    it('should throw NotFoundException if tag not found', async () => {
      // Arrange
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'preload').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, { name: 'New Tag' })).rejects.toThrow(NotFoundException);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 999,
        name: 'New Tag',
      });
    });
  });

  describe('remove', () => {
    it('should delete an existing tag', async () => {
      // Arrange
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result).toEqual({ message: '删除成功' });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tag not found', async () => {
      // Arrange
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });
  });
});