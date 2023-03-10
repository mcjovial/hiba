import { Controller } from '@nestjs/common';
import { MlmService } from './mlm.service';

@Controller('mlm')
export class MlmController {
  constructor(private readonly mlmService: MlmService) {}
}
