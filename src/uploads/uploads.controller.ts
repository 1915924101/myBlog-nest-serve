import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload.dto';

@Controller('upload')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUploadDto: CreateUploadDto,
  ) {
    try {
      const result = await this.uploadsService.uploadFile(file, createUploadDto);
      return { code: 0, status: 'success', message: '上传成功', data: result };
    } catch (error) {
      return { code: 1, status: 'error', message: '上传失败: ' + error.message, data: null };
    }
  }
}