import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(username: string, password: string) {
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('用户已存在');
    }
    const user = this.usersRepository.create({ username, password });
    await this.usersRepository.save(user);
    return {
      code: 0,
      status: 'success',
      message: '注册成功',
      data: { username }
    };
  }

  async login(username: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { username, password } });
    if (!user) {
      throw new UnauthorizedException('用户不存在，请先注册');
    }
    const token = jwt.sign({ username }, 'mytoken');
    return {
      code: 0,
      status: 'success',
      message: '登录成功',
      data: { username, token }
    };
  }
}