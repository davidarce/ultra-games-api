import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateGameDto } from '../src/games/dto/create-game.dto';
import { AppModule } from '../src/app.module';
import { UpdateGameDto } from 'src/games/dto/update-game.dto';

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
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Games', () => {
    // small script to remove all database entries for games between tests
    beforeEach(async () => {
      const uncleared = await request(app.getHttpServer()).get('/games');
      await Promise.all(
        uncleared.body.map(async (game) => {
          return request(app.getHttpServer()).delete(`/games/${game.id}`);
        }),
      );
    });

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

    it(`/POST create game - should validate fields succesfully`, async () => {
      const body: CreateGameDto = {
        title: 'Ultra Game',
        price: 0,
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
        .expect(400);

      expect(data.body).toEqual({
        error: 'Bad Request',
        message: ['price must be a positive number'],
        statusCode: 400,
      });
    });

    it(`/POST sync games - should remove games older than 18 months`, async () => {
      const body: CreateGameDto = {
        title: 'Ultra Game 2.0',
        price: 10,
        releaseDate: new Date('2019-11-29T00:00:00'),
        publisher: {
          name: 'David',
          siret: '12345678911111',
          phone: '0123456789',
        },
        tags: ['action'],
      };

      await request(app.getHttpServer())
        .post('/games')
        .send(body)
        .expect(201);

      await request(app.getHttpServer())
        .post('/games/sync')
        .send(body)
        .expect(202);

      const data = await request(app.getHttpServer()).get('/games').expect(200);

      expect(data.body.length).toBe(0);
    });

    it(`/POST sync games - should apply disscount of 20% to all games having a release date between 12 and 18 months`, async () => {
      const body: CreateGameDto = {
        title: 'Ultra Game 2.0',
        price: 1000,
        releaseDate: new Date('2020-11-29T00:00:00'),
        publisher: {
          name: 'David',
          siret: '12345678911111',
          phone: '0123456789',
        },
        tags: ['action'],
      };

      await request(app.getHttpServer())
        .post('/games')
        .send(body)
        .expect(201);

      await request(app.getHttpServer())
        .post('/games/sync')
        .send(body)
        .expect(202);

      const data = await request(app.getHttpServer())
        .get('/games')
        .expect(200);

      expect(data.body.length).toBe(1);
      expect(data.body[0].price).toBe(800);
    });

    it(`/GET game publisher by id game - should get game publisher given id successfully`, async () => {
      const body: CreateGameDto = {
        title: 'Ultra Game 2.0',
        price: 1000,
        releaseDate: new Date('2020-11-29T00:00:00'),
        publisher: {
          name: 'David',
          siret: '12345678911111',
          phone: '0123456789',
        },
        tags: ['action'],
      };

      const result = await request(app.getHttpServer())
        .post('/games')
        .send(body)
        .expect(201);

      const dataRetrieved = await request(app.getHttpServer())
        .get(`/games/${result.body.id}/publisher`)
        .expect(200);

      expect(dataRetrieved.body).toEqual({
        id: expect.any(Number),
        name: 'David',
        siret: '12345678911111',
        phone: '0123456789',
      });
    });

    it(`/PATCH update game - should update game information successfully`, async () => {
      const createRequest: CreateGameDto = {
        title: 'Ultra Game 2.0',
        price: 1000,
        releaseDate: new Date('2020-11-29T00:00:00'),
        publisher: {
          name: 'David',
          siret: '12345678911111',
          phone: '0123456789',
        },
        tags: ['action'],
      };

      const updateRequest: UpdateGameDto = {
        title: 'Ultra Game 3.0',
        price: 2000,
      };

      const result = await request(app.getHttpServer())
        .post('/games')
        .send(createRequest)
        .expect(201);

      await request(app.getHttpServer())
        .patch(`/games/${result.body.id}`)
        .send(updateRequest)
        .expect(200);

      const dataUpdated = await request(app.getHttpServer())
        .get(`/games/${result.body.id}`)
        .expect(200);

      expect(dataUpdated.body.id).toBe(result.body.id);
      expect(dataUpdated.body.title).toBe('Ultra Game 3.0');
      expect(dataUpdated.body.price).toBe(2000);
    });

    it(`/DELETE remove game - should delete game successfully`, async () => {
      const body: CreateGameDto = {
        title: 'Ultra Game 2.0',
        price: 1000,
        releaseDate: new Date('2020-11-29T00:00:00'),
        publisher: {
          name: 'David',
          siret: '12345678911111',
          phone: '0123456789',
        },
        tags: ['action'],
      };

      const result = await request(app.getHttpServer())
        .post('/games')
        .send(body)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/games/${result.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/games/${result.body.id}`)
        .expect(404);
    });
  });
});
