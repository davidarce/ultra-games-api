import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  CacheInterceptor,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor, CacheInterceptor)
@Controller('games')
@ApiTags('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a game' })
  @ApiCreatedResponse({ description: 'The game has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Some information received is invalid.' })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Post('/sync')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Trigger a process to sync games in the ultra databse',
    description:
      'This process will remove all the games having a release date older than 18 months and apply a discount of 20% to all games having a release date between 12 and 18 months.',
  })
  @ApiAcceptedResponse({ description: 'The process has been successfully triggered.' })
  dispatchProcess() {
    return this.gamesService.syncGames();
  }

  @Get()
  @ApiOperation({ summary: 'Get all the games' })
  @ApiOkResponse({ description: 'The operation has been successfully done.' })
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game by id' })
  @ApiOkResponse({ description: 'The game has been successfully returned.' })
  @ApiNotFoundResponse({ description: 'The game with the id received not exits.' })
  @ApiBadRequestResponse({ description: 'Param id invalid' })
  get(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  @Get(':id/publisher')
  @ApiOperation({ summary: 'Get game publisher by id game' })
  @ApiOkResponse({ description: 'The publisher information has been successfully returned.' })
  @ApiNotFoundResponse({ description: 'The game with the id received not exits.' })
  @ApiBadRequestResponse({ description: 'Param id invalid' })
  getGamePublisher(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findGamePublisher(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update game by id' })
  @ApiOkResponse({ description: 'the game information has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'The game with the id received not exits.' })
  @ApiBadRequestResponse({ description: 'Param id invalid' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete game by id' })
  @ApiOkResponse({ description: 'the game has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'The game with the id received not exits.' })
  @ApiBadRequestResponse({ description: 'Param id invalid' })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
