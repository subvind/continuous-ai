import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YamlActionsModule } from './yaml-actions/yaml-actions.module';
import { CustomLogger } from './logger/custom-logger';

@Module({
  imports: [YamlActionsModule],
  controllers: [AppController],
  providers: [
    AppService,
    CustomLogger
  ],
})
export class AppModule {}