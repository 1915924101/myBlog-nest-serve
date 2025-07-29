// 导入NestJS核心模块 - NestFactory用于创建Nest应用实例
import { NestFactory } from '@nestjs/core';
// 导入应用的根模块 - 所有NestJS应用都有一个根模块作为应用的入口点
import { AppModule } from './app.module';
// 导入CORS中间件 - 用于处理跨域请求
import * as cors from 'cors';
// 导入Swagger相关模块 - 用于生成API文档
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 导入响应拦截器 - 用于格式化时间字段
import { TransformInterceptor } from './shared/transform.interceptor';

/**
 * 应用启动函数
 * NestJS应用使用异步函数作为启动入口
 */
async function bootstrap() {
  // 创建Nest应用实例，并传入根模块
  const app = await NestFactory.create(AppModule);
  
  // 全局注册响应拦截器，用于格式化时间字段
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // 启用CORS中间件，允许跨域请求
  // 对于生产环境，建议配置具体的origin选项以提高安全性
  app.use(cors());

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('博客系统API')
    .setDescription('基于NestJS和TypeORM的博客系统API文档')
    .setVersion('1.0')
    .addTag('博客')
    .build();

  // 构建文档
  const document = SwaggerModule.createDocument(app, config);

  // 设置Swagger UI路径，访问地址：http://localhost:31008/api-docs
  SwaggerModule.setup('api-docs', app, document);

  // 启动应用并监听指定端口
  // 31010是当前应用使用的端口号，可以根据需要修改
  await app.listen(31010);
  
  // 可选：打印启动信息到控制台
  // 应用启动信息已移除，生产环境不输出控制台日志
}

// 调用启动函数，启动应用
bootstrap();