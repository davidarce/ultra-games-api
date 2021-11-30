import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PublisherDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Length(14, 14)
  readonly siret: string;

  @IsString()
  @IsNotEmpty()
  readonly phone: string;
}
