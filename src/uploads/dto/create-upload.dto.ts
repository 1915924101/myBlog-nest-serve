import { IsString, IsOptional } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  filename: string;

  @IsOptional()
  path?: string;

  @IsOptional()
  size?: number;
}