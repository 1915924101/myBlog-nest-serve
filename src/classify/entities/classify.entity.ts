import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';

@Entity('classify')
export class Classify {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Article, article => article.classify)
  articles: Article[];
}