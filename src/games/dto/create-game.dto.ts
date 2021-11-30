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
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ValidateNested()
  @Type(() => PublisherDto)
  readonly publisher: PublisherDto;


  @ArrayNotEmpty()
  @IsNotEmpty({
    each: true,
  })
  readonly tags: string[];

  @IsDate()
  @Type(() => Date)
  readonly releaseDate: Date;
}
