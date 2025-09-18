import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerService,
  registerSingleton,
  registerValue,
  resolve,
  isRegistered,
  createToken,
  TOKENS,
  registerServices,
  clearContainer,
  createTestContainer,
} from '../utils';
import { ServiceLifetime } from '../types';
import { Injectable } from '../decorators';

// 測試用的服務類別
@Injectable()
class TestService {
  getValue(): string {
    return 'test-value';
  }
}

@Injectable()
class AnotherTestService {
  getValue(): string {
    return 'another-test-value';
  }
}

describe('IoC Utils', () => {
  beforeEach(() => {
    clearContainer();
  });

  describe('服務註冊工具函數', () => {
    it('registerService 應該能夠註冊服務', () => {
      // Arrange
      const token = 'TestService';

      // Act
      registerService(token, TestService);
      const instance = resolve<TestService>(token);

      // Assert
      expect(instance).toBeInstanceOf(TestService);
      expect(instance.getValue()).toBe('test-value');
    });

    it('registerService 應該能夠指定生命週期', () => {
      // Arrange
      const token = 'SingletonTestService';

      // Act
      registerService(token, TestService, ServiceLifetime.SINGLETON);
      const instance1 = resolve<TestService>(token);
      const instance2 = resolve<TestService>(token);

      // Assert
      expect(instance1).toBe(instance2);
    });

    it('registerSingleton 應該能夠註冊單例服務', () => {
      // Arrange
      const token = 'SingletonService';

      // Act
      registerSingleton(token, TestService);
      const instance1 = resolve<TestService>(token);
      const instance2 = resolve<TestService>(token);

      // Assert
      expect(instance1).toBe(instance2);
    });

    it('registerValue 應該能夠註冊值', () => {
      // Arrange
      const token = 'TestValue';
      const value = { name: 'test', value: 42 };

      // Act
      registerValue(token, value);
      const result = resolve(token);

      // Assert
      expect(result).toBe(value);
    });
  });

  describe('服務解析工具函數', () => {
    it('resolve 應該能夠解析已註冊的服務', () => {
      // Arrange
      const token = 'TestService';
      registerService(token, TestService);

      // Act
      const instance = resolve<TestService>(token);

      // Assert
      expect(instance).toBeInstanceOf(TestService);
    });

    it('resolve 應該在服務未註冊時拋出錯誤', () => {
      // Arrange
      const token = 'UnregisteredService';

      // Act & Assert
      expect(() => resolve(token)).toThrow();
    });

    it('isRegistered 應該能夠檢查服務是否已註冊', () => {
      // Arrange
      const registeredToken = 'RegisteredService';
      const unregisteredToken = 'UnregisteredService';
      registerService(registeredToken, TestService);

      // Act & Assert
      expect(isRegistered(registeredToken)).toBe(true);
      expect(isRegistered(unregisteredToken)).toBe(false);
    });
  });

  describe('Token 工具函數', () => {
    it('createToken 應該能夠建立唯一的 symbol token', () => {
      // Act
      const token1 = createToken('TestToken');
      const token2 = createToken('TestToken');

      // Assert
      expect(typeof token1).toBe('symbol');
      expect(typeof token2).toBe('symbol');
      expect(token1).not.toBe(token2);
      expect(token1.description).toBe('TestToken');
    });

    it('TOKENS 常數應該包含預定義的 tokens', () => {
      // Assert
      expect(typeof TOKENS.CONFIG_SERVICE).toBe('symbol');
      expect(typeof TOKENS.LOGGER_SERVICE).toBe('symbol');
      expect(typeof TOKENS.CACHE_SERVICE).toBe('symbol');
      expect(typeof TOKENS.HTTP_CLIENT).toBe('symbol');
      expect(typeof TOKENS.DATABASE_CONNECTION).toBe('symbol');
      expect(typeof TOKENS.USER_SERVICE).toBe('symbol');
      expect(typeof TOKENS.AUTH_SERVICE).toBe('symbol');
    });
  });

  describe('批量註冊工具函數', () => {
    it('registerServices 應該能夠批量註冊服務', () => {
      // Arrange
      const services = [
        { token: 'TestService1', implementation: TestService },
        {
          token: 'TestService2',
          implementation: AnotherTestService,
          lifetime: ServiceLifetime.SINGLETON,
        },
      ];

      // Act
      registerServices(services);

      // Assert
      expect(isRegistered('TestService1')).toBe(true);
      expect(isRegistered('TestService2')).toBe(true);

      const instance1a = resolve<TestService>('TestService1');
      const instance1b = resolve<TestService>('TestService1');
      const instance2a = resolve<AnotherTestService>('TestService2');
      const instance2b = resolve<AnotherTestService>('TestService2');

      // TestService1 應該是 transient (不同實例)
      expect(instance1a).not.toBe(instance1b);
      // TestService2 應該是 singleton (相同實例)
      expect(instance2a).toBe(instance2b);
    });

    it('registerServices 應該使用預設的 TRANSIENT 生命週期', () => {
      // Arrange
      const services = [{ token: 'TestService', implementation: TestService }];

      // Act
      registerServices(services);
      const instance1 = resolve<TestService>('TestService');
      const instance2 = resolve<TestService>('TestService');

      // Assert
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('容器管理工具函數', () => {
    it('clearContainer 應該能夠清除所有註冊', () => {
      // Arrange
      registerSingleton('TestService', TestService);
      const instance1 = resolve<TestService>('TestService');

      // Act
      clearContainer();
      const instance2 = resolve<TestService>('TestService');

      // Assert
      expect(instance1).not.toBe(instance2);
    });

    it('createTestContainer 應該能夠建立測試容器', () => {
      // Arrange
      registerValue('ParentValue', 'parent');

      // Act
      const testContainer = createTestContainer();

      // Assert
      expect(testContainer).toBeDefined();
      expect(testContainer.get('ParentValue')).toBe('parent');

      // 測試容器應該能夠註冊自己的服務
      testContainer.register('TestValue', 'test');
      expect(testContainer.get('TestValue')).toBe('test');
    });
  });

  describe('錯誤處理', () => {
    it('應該在解析未註冊服務時拋出適當的錯誤', () => {
      // Act & Assert
      expect(() => resolve('UnregisteredService')).toThrow();
    });

    it('isRegistered 應該安全地處理未註冊的服務', () => {
      // Act & Assert
      expect(() => isRegistered('UnregisteredService')).not.toThrow();
      expect(isRegistered('UnregisteredService')).toBe(false);
    });
  });
});
