import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

const expectedGames: Game[] = [
  {
    id: 1,
    title: 'test',
    price: 100,
    publisher: {
      id: 1,
      name: 'test',
      siret: '123456789',
      phone: '1111',
      games: [],
    },
    tags: [],
    releaseDate: new Date(),
  },
];

describe('GamesService', () => {
  let service: GamesService;
  let repository: Repository<Game>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    repository = module.get<Repository<Game>>(getRepositoryToken(Game));
  });

  it('findAll', async () => {
    jest.spyOn(repository, 'find').mockImplementation(async () => expectedGames);

    expect(await service.findAll()).toBe(expectedGames);
  });
});
