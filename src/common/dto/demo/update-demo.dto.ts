import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * 更新 Demo 項目的 DTO
 */
export class UpdateDemoDto {
  /**
   * Demo 項目名稱
   */
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '名稱至少需要 2 個字符' })
  @MaxLength(50, { message: '名稱不能超過 50 個字符' })
  name?: string;

  /**
   * Demo 項目描述
   */
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '描述不能超過 200 個字符' })
  description?: string;

  /**
   * Demo 項目類別
   */
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * 聯絡人郵箱
   */
  @IsOptional()
  @IsEmail({}, { message: '請提供有效的郵箱地址' })
  email?: string;

  /**
   * 優先級 (1-10)
   */
  @IsOptional()
  @IsNumber({}, { message: '優先級必須是數字' })
  priority?: number;

  /**
   * 標籤
   */
  @IsOptional()
  @IsString()
  tags?: string;
}
