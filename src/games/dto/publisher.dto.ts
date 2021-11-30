import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PublisherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @Length(14, 14)
  readonly siret: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phone: string;
}
