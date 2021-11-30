import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PublisherDto } from './publisher.dto';

export class CreateGameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PublisherDto)
  readonly publisher: PublisherDto;

  @ApiProperty()
  @ArrayNotEmpty()
  @IsNotEmpty({
    each: true,
  })
  readonly tags: string[];

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly releaseDate: Date;
}
