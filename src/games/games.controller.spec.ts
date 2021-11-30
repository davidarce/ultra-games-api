import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

const moduleMocker = new ModuleMocker(global);

const expectedResult: Game = {
  id: 1,
  title: 'test',
  price: 10,
  releaseDate: new Date(),
  publisher: null,
  tags: null,
};

describe('GamesController', () => {
  let controller: GamesController;
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<GamesController>(GamesController);
    service = module.get<GamesService>(GamesService);
  });

  describe('create', () => {
    it('should create game succesfully', async () => {
      const request: CreateGameDto = {
        title: 'test',
        price: 10,
        releaseDate: new Date(),
        publisher: null,
        tags: null,
      };

      jest.spyOn(service, 'create').mockImplementation(async () => expectedResult);

      expect(await controller.create(request)).toBe(expectedResult);
    });
  });
});
