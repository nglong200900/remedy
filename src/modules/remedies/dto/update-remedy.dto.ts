import { PartialType } from '@nestjs/swagger';
import { CreateRemedyDto } from './create-remedy.dto';

export class UpdateRemedyDto extends PartialType(CreateRemedyDto) {}
