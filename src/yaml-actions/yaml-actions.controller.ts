import { Controller, Post, Body } from '@nestjs/common';
import { YamlActionsService } from './yaml-actions.service';

@Controller('yaml-actions')
export class YamlActionsController {
  constructor(private readonly yamlActionsService: YamlActionsService) {}

  @Post('process')
  processYamlString(@Body('yaml') yamlString: string) {
    const parsedYaml = this.yamlActionsService.parseYamlString(yamlString);
    this.yamlActionsService.executeActions(parsedYaml);
    return { message: 'YAML string processed successfully' };
  }
}