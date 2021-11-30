import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Publisher } from './publisher.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @ManyToOne((_type) => Publisher, (publisher) => publisher.games, {
    cascade: true,
  })
  publisher: Publisher;

  @Column('simple-array')
  tags: string[];

  @Column()
  releaseDate: Date;
}
