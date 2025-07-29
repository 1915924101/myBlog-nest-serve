import { IsString } from 'class-validator';

export class CreateClassifyDto {
  @IsString()
  name: string;
}