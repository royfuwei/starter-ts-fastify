/**
 * 應用程式資訊回應 DTO
 */
export class AppInfoDTO {
  name: string;
  version: string;
  description: string;
  environment: string;
  startTime: Date;

  constructor(
    name: string,
    version: string,
    description: string,
    environment: string,
    startTime: Date,
  ) {
    this.name = name;
    this.version = version;
    this.description = description;
    this.environment = environment;
    this.startTime = startTime;
  }
}

/**
 * 示例資料 DTO
 */
export class DemoDataDTO {
  id: string;
  name: string;
  value: unknown;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    value: unknown,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
