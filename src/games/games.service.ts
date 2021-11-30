import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Between, LessThan, Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { Publisher } from './entities/publisher.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const gameEntity = plainToClass(Game, createGameDto);
    return await this.gamesRepository.save(gameEntity);
  }

  async syncGames(): Promise<void> {
    await this.removeOldGames();
    await this.applyDiscount();
  }

  async findAll(): Promise<Game[]> {
    return await this.gamesRepository.find();
  }

  async findOne(id: number): Promise<Game> {
    const gameFound = await this.gamesRepository.findOne(id);

    if (!gameFound) {
      throw new NotFoundException(`Game with id: ${id} not found`);
    }

    return gameFound;
  }

  async findGamePublisher(id: number): Promise<Publisher> {
    const gameFound = await this.gamesRepository.findOne(id, {
      relations: ['publisher'],
    });
    return gameFound.publisher;
  }

  async update(id: number, updateGameDto: UpdateGameDto): Promise<void> {
    let gameEntity = await this.findOne(id);
    const updatedGameEntity = plainToClass(Game, updateGameDto);
    let gameToUpdate = { ...gameEntity, ...updatedGameEntity };
    await this.gamesRepository.save(gameToUpdate);
  }

  async remove(id: number): Promise<void> {
    let gameEntity = await this.findOne(id);
    await this.gamesRepository.delete(gameEntity.id);
  }

  private async removeOldGames() {
    // remove games older than 18 months
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 18);

    const gamesToRemove = await this.gamesRepository.find({
      where: {
        releaseDate: LessThan(startDate.toISOString()),
      },
    });

    await this.gamesRepository.remove(gamesToRemove);
  }

  private async applyDiscount() {
    // apply a discount of 20% to all games having a release date between 12 and 18 months
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 18);

    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 12);

    const gamesWithDisccount = await this.gamesRepository.find({
      where: {
        releaseDate: Between(startDate.toISOString(), endDate.toISOString()),
      },
    });

    const gamesToUpdate = await Promise.all(
      gamesWithDisccount.map((game) => {
        game.price = game.price - (game.price * 0.2);
        console.log('new price: ', JSON.stringify(game.price));
        return game;
      }),
    );

    await this.gamesRepository.save(gamesToUpdate);
  }
}
