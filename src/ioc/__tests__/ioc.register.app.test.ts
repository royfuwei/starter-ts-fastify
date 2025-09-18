import { describe, it, expect, beforeEach } from 'vitest';
import {
  AppServiceRegistry,
  ServiceRegistryFactory,
  initializeAppServices,
} from '../ioc.register.app';
import { ServiceRegistry } from '../types';

// 模擬服務註冊器
class MockServiceRegistry implements ServiceRegistry {
  public registerCalled = false;

  register(): void {
    this.registerCalled = true;
  }
}

describe('AppServiceRegistry', () => {
  let appRegistry: AppServiceRegistry;

  beforeEach(() => {
    appRegistry = new AppServiceRegistry();
  });

  describe('基本功能測試', () => {
    it('應該能夠建立 AppServiceRegistry 實例', () => {
      // Assert
      expect(appRegistry).toBeInstanceOf(AppServiceRegistry);
    });

    it('應該能夠執行 register 方法而不拋出錯誤', () => {
      // Act & Assert
      expect(() => appRegistry.register()).not.toThrow();
    });
  });
});

describe('ServiceRegistryFactory', () => {
  beforeEach(() => {
    ServiceRegistryFactory.clear();
  });

  describe('註冊器管理測試', () => {
    it('應該能夠新增服務註冊器', () => {
      // Arrange
      const mockRegistry = new MockServiceRegistry();

      // Act
      ServiceRegistryFactory.addRegistry(mockRegistry);

      // Assert
      expect(ServiceRegistryFactory.getRegistryCount()).toBe(1);
    });

    it('應該能夠新增多個服務註冊器', () => {
      // Arrange
      const mockRegistry1 = new MockServiceRegistry();
      const mockRegistry2 = new MockServiceRegistry();

      // Act
      ServiceRegistryFactory.addRegistry(mockRegistry1);
      ServiceRegistryFactory.addRegistry(mockRegistry2);

      // Assert
      expect(ServiceRegistryFactory.getRegistryCount()).toBe(2);
    });

    it('應該能夠執行所有註冊器', () => {
      // Arrange
      const mockRegistry1 = new MockServiceRegistry();
      const mockRegistry2 = new MockServiceRegistry();
      ServiceRegistryFactory.addRegistry(mockRegistry1);
      ServiceRegistryFactory.addRegistry(mockRegistry2);

      // Act
      ServiceRegistryFactory.registerAll();

      // Assert
      expect(mockRegistry1.registerCalled).toBe(true);
      expect(mockRegistry2.registerCalled).toBe(true);
    });

    it('應該能夠清除所有註冊器', () => {
      // Arrange
      const mockRegistry = new MockServiceRegistry();
      ServiceRegistryFactory.addRegistry(mockRegistry);
      expect(ServiceRegistryFactory.getRegistryCount()).toBe(1);

      // Act
      ServiceRegistryFactory.clear();

      // Assert
      expect(ServiceRegistryFactory.getRegistryCount()).toBe(0);
    });

    it('應該能夠取得註冊器數量', () => {
      // Arrange
      expect(ServiceRegistryFactory.getRegistryCount()).toBe(0);

      // Act
      ServiceRegistryFactory.addRegistry(new MockServiceRegistry());
      ServiceRegistryFactory.addRegistry(new MockServiceRegistry());

      // Assert
      expect(ServiceRegistryFactory.getRegistryCount()).toBe(2);
    });
  });

  describe('空註冊器列表測試', () => {
    it('當沒有註冊器時，registerAll 應該正常執行', () => {
      // Act & Assert
      expect(() => ServiceRegistryFactory.registerAll()).not.toThrow();
    });

    it('當沒有註冊器時，getRegistryCount 應該回傳 0', () => {
      // Act & Assert
      expect(ServiceRegistryFactory.getRegistryCount()).toBe(0);
    });
  });
});

describe('initializeAppServices', () => {
  beforeEach(() => {
    ServiceRegistryFactory.clear();
  });

  it('應該能夠初始化應用程式服務', () => {
    // Act
    initializeAppServices();

    // Assert
    expect(ServiceRegistryFactory.getRegistryCount()).toBe(1);
  });

  it('應該能夠多次呼叫而不會出錯', () => {
    // Act
    initializeAppServices();
    initializeAppServices();

    // Assert
    expect(ServiceRegistryFactory.getRegistryCount()).toBe(2);
  });
});

describe('整合測試', () => {
  beforeEach(() => {
    ServiceRegistryFactory.clear();
  });

  it('應該能夠完整執行服務註冊流程', () => {
    // Arrange
    const mockRegistry = new MockServiceRegistry();

    // Act
    ServiceRegistryFactory.addRegistry(mockRegistry);
    ServiceRegistryFactory.addRegistry(new AppServiceRegistry());
    ServiceRegistryFactory.registerAll();

    // Assert
    expect(ServiceRegistryFactory.getRegistryCount()).toBe(2);
    expect(mockRegistry.registerCalled).toBe(true);
  });
});
