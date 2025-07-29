import { Test, TestingModule } from '@nestjs/testing';
import { ClassifiesService } from './classifies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Classify } from '../classify/entities/classify.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateClassifyDto } from './dto/create-classify.dto';

describe('ClassifiesService', () => {
  let service: ClassifiesService;
  let repository: Repository<Classify>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassifiesService,
        {
          provide: getRepositoryToken(Classify),
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

    service = module.get<ClassifiesService>(ClassifiesService);
    repository = module.get<Repository<Classify>>(getRepositoryToken(Classify));
  });

  describe('create', () => {
    it('should create a new classify successfully', async () => {
      // Arrange
      const createClassifyDto: CreateClassifyDto = { name: 'Test Classify' };
      const classify = { id: 1, ...createClassifyDto };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(classify as Classify);
      jest.spyOn(repository, 'save').mockResolvedValue(classify as Classify);

      // Act
      const result = await service.create(createClassifyDto);

      // Assert
      expect(result).toEqual(classify);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Test Classify' });
      expect(repository.create).toHaveBeenCalledWith(createClassifyDto);
      expect(repository.save).toHaveBeenCalledWith(classify);
    });

    it('should throw ConflictException if classify already exists', async () => {
      // Arrange
      const createClassifyDto: CreateClassifyDto = { name: 'Existing Classify' };
      const existingClassify = { id: 1, ...createClassifyDto };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingClassify as Classify);

      // Act & Assert
      await expect(service.create(createClassifyDto)).rejects.toThrow(ConflictException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Existing Classify' });
    });
  });

  describe('findAll', () => {
    it('should return all classifies', async () => {
      // Arrange
      const classifies = [
        { id: 1, name: 'Classify 1' },
        { id: 2, name: 'Classify 2' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(classifies as Classify[]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(classifies);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a classify by id', async () => {
      // Arrange
      const classify = { id: 1, name: 'Test Classify' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(classify as Classify);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(classify);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if classify not found', async () => {
      // Arrange
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('update', () => {
    it('should update an existing classify', async () => {
      // Arrange
      const updateData = { name: 'Updated Classify' };
      const classify = { id: 1, name: 'Original Classify' };
      const updatedClassify = { id: 1, ...updateData };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'preload').mockResolvedValue(updatedClassify as Classify);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedClassify as Classify);

      // Act
      const result = await service.update(1, updateData);

      // Assert
      expect(result).toEqual(updatedClassify);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Updated Classify' });
      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateData,
      });
      expect(repository.save).toHaveBeenCalledWith(updatedClassify);
    });

    it('should throw ConflictException if classify name already exists', async () => {
      // Arrange
      const updateData = { name: 'Existing Classify' };
      const existingClassify = { id: 2, ...updateData };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingClassify as Classify);

      // Act & Assert
      await expect(service.update(1, updateData)).rejects.toThrow(ConflictException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ name: 'Existing Classify' });
    });

    it('should throw NotFoundException if classify not found', async () => {
      // Arrange
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'preload').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, { name: 'New Classify' })).rejects.toThrow(NotFoundException);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 999,
        name: 'New Classify',
      });
    });
  });

  describe('remove', () => {
    it('should delete an existing classify', async () => {
      // Arrange
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result).toEqual({ message: '删除成功' });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if classify not found', async () => {
      // Arrange
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });
  });
});