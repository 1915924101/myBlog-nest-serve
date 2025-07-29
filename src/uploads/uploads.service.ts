import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import * as COS from 'cos-nodejs-sdk-v5';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  private cosClient: COS;

  constructor(private configService: ConfigService) {
    // 初始化腾讯云COS客户端
    this.cosClient = new COS({
      SecretId: this.configService.get('COS_SECRET_ID'),
      SecretKey: this.configService.get('COS_SECRET_KEY'),
    });
  }

  async uploadFile(file: Express.Multer.File, createUploadDto: CreateUploadDto) {
    try {
      // 读取文件内容
      const fileContent = fs.readFileSync(file.path);

      // 构建上传参数
      const uploadParams = {
        Bucket: this.configService.get('COS_BUCKET'), 
        Region: this.configService.get('COS_REGION'), 
        Key: `${Date.now()}-${file.originalname}`, // 文件名
        Body: fileContent, // 文件内容
        ContentLength: file.size, // 文件大小
      };

      // 上传文件到腾讯云COS
      const result = await this.cosClient.putObject(uploadParams);

      // 删除本地临时文件
      fs.unlinkSync(file.path);

      return {
        url: result.Location,
        filename: file.originalname,
        size: file.size,
      };
    } catch (error) {
      // 发生错误时删除本地临时文件
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new Error(`文件上传失败: ${error.message}`);
    }
  }
}