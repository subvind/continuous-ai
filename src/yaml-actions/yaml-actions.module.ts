import { Module } from '@nestjs/common';
import { YamlActionsService } from './yaml-actions.service';
import { YamlActionsController } from './yaml-actions.controller';
import { CustomLogger } from '../logger/custom-logger';

@Module({
  providers: [YamlActionsService, CustomLogger],
  controllers: [YamlActionsController],
  exports: [YamlActionsService],
})
export class YamlActionsModule {}