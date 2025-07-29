// 导入NestJS核心模块 - Module装饰器用于定义模块
import { Module } from '@nestjs/common';
// 导入配置模块 - 用于处理环境变量
import { ConfigModule, ConfigService } from '@nestjs/config';
// 导入TypeORM模块 - 用于与数据库交互
import { TypeOrmModule } from '@nestjs/typeorm';

// 导入功能模块
import { UsersModule } from './users/users.module';         // 用户模块
import { ArticlesModule } from './articles/articles.module'; // 文章模块
import { TagsModule } from './tags/tags.module';           // 标签模块
import { ClassifiesModule } from './classifies/classifies.module'; // 分类模块
import { UploadsModule } from './uploads/uploads.module';   // 文件上传模块

// 导入实体类 - 用于TypeORM映射数据库表
import { User } from './users/entities/user.entity';
import { Article } from './articles/entities/article.entity';
import { Tag } from './tags/entities/tag.entity';
import { Classify } from './classify/entities/classify.entity';
import * as path from 'path'
/**
 * 应用的根模块
 * 所有NestJS应用都有一个根模块，作为应用的入口点
 * 根模块负责导入和配置其他模块
 */
@Module({
  imports: [
    // 配置TypeORM连接
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '.env')
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Article, Tag, Classify],
          synchronize: false,
          logging: true,
        }),
      inject: [ConfigService],
    }),
    
    // 导入功能模块
    UsersModule,        // 用户模块
    ArticlesModule,     // 文章模块
    TagsModule,         // 标签模块
    ClassifiesModule,   // 分类模块
    UploadsModule       // 文件上传模块
  ]
})
export class AppModule {
  // 根模块通常不需要额外的方法或属性
}