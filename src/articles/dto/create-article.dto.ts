import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  tag_id: number;

  @IsNumber()
  class_id: number;

  @IsOptional()
  view_count?: number;

  @IsOptional()
  like_count?: number;

  @IsOptional()
  cover_url?: string;

  @IsOptional()
  img_name?: string;
}