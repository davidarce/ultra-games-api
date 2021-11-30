import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreateGameDto } from '../src/games/dto/create-game.dto';
import { AppModule } from '../src/app.module';

const expectedResult = {
  id: expect.any(Number),
  title: 'Ultra Game',
  price: 10,
  releaseDate: '2021-11-29T05:00:00.000Z',
  publisher: {
    id: expect.any(Number),
    name: 'David',
    siret: '12345678911111',
    phone: '0123456789',
  },
  tags: ['action'],
};

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Games', () => {
    it(`/POST create game`, async () => {
      const body: CreateGameDto = {
        title: 'Ultra Game',
        price: 10,
        releaseDate: new Date('2021-11-29T00:00:00'),
        publisher: {
          name: 'David',
          siret: '12345678911111',
          phone: '0123456789',
        },
        tags: ['action'],
      };

      const data = await request(app.getHttpServer())
        .post('/games')
        .send(body)
        .expect(201);

      expect(data.body).toEqual(expectedResult);
    });
  });
});
