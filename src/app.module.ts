import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from './games/games.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 20,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      synchronize: true,
      database: './database.sqlite',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
    }),
    GamesModule,
    HealthModule,
  ],
})
export class AppModule {}
