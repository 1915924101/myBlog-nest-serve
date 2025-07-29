import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: Repository<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  describe('create', () => {
    it('should create a new article successfully', async () => {
      // Arrange
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        content: 'Test Content',
        tag_id: 1,
        class_id: 1,
      };
      const article = {
        id: 1,
        title: createArticleDto.title,
        content: createArticleDto.content,
        tagId: createArticleDto.tag_id,
        classId: createArticleDto.class_id,
        createTime: new Date(),
        updateTime: null,
        status: 1,
        coverUrl: null,
        imgName: null,
        viewCount: 0,
        likeCount: 0,
        tag: undefined,
        classify: undefined
      };

      jest.spyOn(repository, 'create').mockReturnValue(article as Article);
      jest.spyOn(repository, 'save').mockResolvedValue(article as Article);

      // Act
      const result = await service.create(createArticleDto);

      // Assert
      expect(result).toEqual(article);
      expect(repository.create).toHaveBeenCalledWith({
        ...createArticleDto,
        createTime: expect.any(Date),
        status: 1,
      });
      expect(repository.save).toHaveBeenCalledWith(article);
    });
  });

  describe('findAll', () => {
    it('should return paginated articles', async () => {
      // Arrange
      const query = { page: 1, size: 10 };
      const articles = [
        { id: 1, title: 'Article 1', content: 'Content 1', createTime: new Date(), updateTime: null, status: 1, coverUrl: null, tagId: 1, classId: 1, imgName: null, viewCount: 0, likeCount: 0, tag: undefined, classify: undefined },
        { id: 2, title: 'Article 2', content: 'Content 2', createTime: new Date(), updateTime: null, status: 1, coverUrl: null, tagId: 1, classId: 1, imgName: null, viewCount: 0, likeCount: 0, tag: undefined, classify: undefined },
      ];
      const total = 2;

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([articles, total]);

      // Act
      const result = await service.findAll(query);

      // Assert
      expect(result).toEqual({ data: articles, total });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { id: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter articles by tag_id and class_id', async () => {
      // Arrange
      const query = { page: 1, size: 10, tag_id: 1, class_id: 2 };
      const article = { id: 1, title: 'Filtered Article', content: 'Filtered Content', createTime: new Date(), updateTime: null, status: 1, coverUrl: null, tagId: 1, classId: 2, imgName: null, viewCount: 0, likeCount: 0, tag: undefined, classify: undefined };
      const articles = [article];
      const total = 1;

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([articles, total]);

      // Act
      const result = await service.findAll(query);

      // Assert
      expect(result).toEqual({ data: articles, total });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { tagId: 1, classId: 2 },
        order: { id: 'DESC' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return an article by id', async () => {
      // Arrange
      const article = { id: 1, title: 'Test Article', content: 'Test Content' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(article as Article);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(article);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if article not found', async () => {
      // Arrange
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('update', () => {
    it('should update an existing article', async () => {
      // Arrange
      const updateData = { title: 'Updated Title' };
      const article = {
        id: 1,
        title: 'Original Title',
        content: 'Original Content',
        updateTime: new Date(),
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(article as Article);
      jest.spyOn(repository, 'save').mockResolvedValue(article as Article);

      // Act
      const result = await service.update(1, updateData);

      // Assert
      expect(result).toEqual(article);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateData,
        updateTime: expect.any(Date),
      });
      expect(repository.save).toHaveBeenCalledWith(article);
    });

    it('should throw NotFoundException if article not found', async () => {
      // Arrange
      jest.spyOn(repository, 'preload').mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, { title: 'New Title' })).rejects.toThrow(NotFoundException);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 999,
        title: 'New Title',
        updateTime: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should delete an existing article', async () => {
      // Arrange
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result).toEqual({ message: '删除成功' });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if article not found', async () => {
      // Arrange
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count by 1', async () => {
      // Arrange
      const article = { id: 1, title: 'Test Article', viewCount: 5 };
      const updatedArticle = { ...article, viewCount: 6 };

      jest.spyOn(service, 'findOne').mockResolvedValue(article as Article);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedArticle as Article);

      // Act
      const result = await service.incrementViewCount(1);

      // Assert
      expect(result).toEqual(updatedArticle);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(updatedArticle);
    });
  });

  describe('incrementLikeCount', () => {
    it('should increment like count by 1', async () => {
      // Arrange
      const article = { id: 1, title: 'Test Article', likeCount: 3 };
      const updatedArticle = { ...article, likeCount: 4 };

      jest.spyOn(service, 'findOne').mockResolvedValue(article as Article);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedArticle as Article);

      // Act
      const result = await service.incrementLikeCount(1);

      // Assert
      expect(result).toEqual(updatedArticle);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(updatedArticle);
    });
  });
});