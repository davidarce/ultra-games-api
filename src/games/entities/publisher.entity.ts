import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity()
export class Publisher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  siret: string;

  @Column()
  phone: string;

  @OneToMany((_type) => Game, (game) => game.publisher)
  games: Game[];
}
