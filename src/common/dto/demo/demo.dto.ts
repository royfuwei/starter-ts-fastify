import {
  IsString,
  IsNumber,
  IsEmail,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * Demo 項目實體 DTO
 */
export class DemoDto {
  /**
   * Demo 項目 ID
   */
  @IsUUID()
  id: string;

  /**
   * Demo 項目名稱
   */
  @IsString()
  name: string;

  /**
   * Demo 項目描述
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Demo 項目類別
   */
  @IsString()
  category: string;

  /**
   * 聯絡人郵箱
   */
  @IsEmail()
  email: string;

  /**
   * 優先級 (1-10)
   */
  @IsOptional()
  @IsNumber()
  priority?: number;

  /**
   * 標籤
   */
  @IsOptional()
  @IsString()
  tags?: string;

  /**
   * 建立時間
   */
  @IsDateString()
  createdAt: string;

  /**
   * 更新時間
   */
  @IsDateString()
  updatedAt: string;

  constructor(data: Partial<DemoDto>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description;
    this.category = data.category || '';
    this.email = data.email || '';
    this.priority = data.priority;
    this.tags = data.tags;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

/**
 * Demo 列表查詢參數 DTO
 */
export class DemoQueryDto {
  /**
   * 頁碼
   */
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  /**
   * 每頁筆數
   */
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  /**
   * 搜尋關鍵字
   */
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * 類別篩選
   */
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * 排序欄位
   */
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  /**
   * 排序方向
   */
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
