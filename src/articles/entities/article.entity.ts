import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { Classify } from '../../classify/entities/classify.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ name: 'create_time', type: 'datetime' })
  createTime: Date;

  @Column({ name: 'update_time', type: 'datetime', nullable: true })
  updateTime: Date;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ default: 1 })
  status: number;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string;

  @Column({ name: 'tag_id' })
  tagId: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'img_name', nullable: true })
  imgName: string;

  @ManyToOne(() => Tag, tag => tag.articles)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Classify, classify => classify.articles)
  @JoinColumn({ name: 'class_id' })
  classify: Classify;
}