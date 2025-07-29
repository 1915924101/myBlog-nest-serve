import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${file.fieldname}-${uniqueSuffix}${file.originalname.slice(file.originalname.lastIndexOf('.'))}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})export class UploadsModule {}