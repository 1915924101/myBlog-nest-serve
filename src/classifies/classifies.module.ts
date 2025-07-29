import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classify } from '../classify/entities/classify.entity';
import { ClassifiesController } from './classifies.controller';
import { ClassifiesService } from './classifies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Classify])],
  controllers: [ClassifiesController],
  providers: [ClassifiesService],
})export class ClassifiesModule {}