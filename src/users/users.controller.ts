// 导入NestJS控制器相关的装饰器和异常类
import { Controller, Post, Body, Get, Query, HttpCode, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
// 导入用户服务 - 用于处理用户相关的业务逻辑
import { UsersService } from './users.service';
// 导入jsonwebtoken - 用于验证JWT令牌
import * as jwt from 'jsonwebtoken';

/**
 * 用户控制器
 * 处理用户相关的HTTP请求
 * @Controller('users') 表示该控制器处理以'/users'开头的路由
 */
@Controller('users')
export class UsersController {
  /**
   * 构造函数
   * 使用依赖注入的方式注入UsersService
   * @param usersService 用户服务实例
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * 用户注册接口
   * @Post('register') 处理POST请求，路由为'/users/register'
   * @param body 请求体，包含username和password
   * @returns 注册结果
   */
  @Post('register')
  @HttpCode(200) // 设置成功状态码为200
  async register(@Body() body: { username: string; password: string }) {
    try {
      // 调用用户服务的register方法处理注册逻辑
      return this.usersService.register(body.username, body.password);
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('注册失败: ' + error.message);
    }
  }

  /**
   * 用户登录接口
   * @Post('login') 处理POST请求，路由为'/users/login'
   * @param body 请求体，包含username和password
   * @returns 登录结果，包含token
   */
  @Post('login')
  @HttpCode(200) // 设置成功状态码为200
  async login(@Body() body: { username: string; password: string }) {
    try {
      // 调用用户服务的login方法处理登录逻辑
      return this.usersService.login(body.username, body.password);
    } catch (error) {
      // 发生异常时返回500状态码
      throw new InternalServerErrorException('登录失败: ' + error.message);
    }
  }

  /**
   * 获取用户信息接口
   * @Get('info') 处理GET请求，路由为'/users/info'
   * @param token 查询参数中的JWT令牌
   * @returns 用户信息
   * @throws UnauthorizedException 当token不存在或无效时抛出
   * @throws InternalServerErrorException 当发生其他错误时抛出
   */
  @Get('info')
  @HttpCode(200) // 设置成功状态码为200
  async getInfo(@Query('token') token: string) {
    try {
      // 检查token是否存在
      if (!token) {
        throw new UnauthorizedException('登录失效，请重新登录');
      }
      
      // 验证token的有效性
      // 'mytoken'是用于签名的密钥，实际项目中应存储在环境变量中
      const payload = jwt.verify(token, 'mytoken') as any;
      
      // 返回用户信息
      return {
        code: 0,
        status: 'success',
        message: '请求成功',
        data: {
          name: payload.username,
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        }
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        // 当token不存在或验证失败时抛出UnauthorizedException
        throw err;
      } else {
        // 发生其他异常时返回500状态码
        throw new InternalServerErrorException('获取用户信息失败: ' + err.message);
      }
    }
  }
}