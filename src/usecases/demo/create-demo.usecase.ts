/**
 * 建立 Demo UseCase
 * 處理建立 Demo 項目的業務流程
 */

import { UseCase } from '../../common/decorators/service.decorator';
import { Inject } from '../../common/decorators/inject.decorator';
import { IDemoService } from '../../services/demo/demo.service.interface';
import { DemoDto } from '../../common/dto/demo/demo.dto';
import { CreateDemoDto } from '../../common/dto/demo/create-demo.dto';
import { TYPES } from '../../common/container/types';

@UseCase(TYPES.CreateDemoUseCase)
export class CreateDemoUseCase {
  constructor(
    @Inject(TYPES.DemoService)
    private readonly demoService: IDemoService,
  ) {}

  /**
   * 執行建立 Demo 項目的業務流程
   */
  async execute(data: CreateDemoDto): Promise<DemoDto> {
    try {
      // 記錄操作日誌
      console.log(`Creating new demo item: ${data.name}`);

      // 執行建立操作
      const newDemo = await this.demoService.create(data);

      // 記錄成功日誌
      console.log(`Demo item created successfully with ID: ${newDemo.id}`);

      return newDemo;
    } catch (error) {
      // 記錄錯誤日誌
      console.error('Failed to create demo item:', error);
      throw error;
    }
  }
}
