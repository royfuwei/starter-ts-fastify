import { describe, it, expect, beforeEach } from 'vitest';
import { TsyringeAdapter } from '../iocAdapter';
import { ServiceLifetime } from '../types';
import { Injectable, Singleton } from '../decorators';

// 測試用的服務類別
@Injectable()
class TestService {
  getValue(): string {
    return 'test-value';
  }
}

@Singleton()
class SingletonTestService {
  private static instanceCount = 0;
  public readonly instanceId: number;

  constructor() {
    SingletonTestService.instanceCount++;
    this.instanceId = SingletonTestService.instanceCount;
  }

  static getInstanceCount(): number {
    return this.instanceCount;
  }

  static resetInstanceCount(): void {
    this.instanceCount = 0;
  }
}

// Test interfaces and implementations are defined but may not be used in all tests

describe('TsyringeAdapter', () => {
  let adapter: TsyringeAdapter;

  beforeEach(() => {
    adapter = new TsyringeAdapter();
    SingletonTestService.resetInstanceCount();
  });

  describe('基本功能測試', () => {
    it('應該能夠註冊和解析服務', () => {
      // Arrange
      const testValue = 'test-value';
      const token = 'TestToken';

      // Act
      adapter.register(token, testValue);
      const result = adapter.get<string>(token);

      // Assert
      expect(result).toBe(testValue);
    });

    it('應該能夠解析類別實例', () => {
      // Act
      const instance = adapter.resolve(TestService);

      // Assert
      expect(instance).toBeInstanceOf(TestService);
      expect(instance.getValue()).toBe('test-value');
    });

    it('應該能夠註冊單例服務', () => {
      // Act
      adapter.registerSingleton('SingletonService', SingletonTestService);
      const instance1 = adapter.get<SingletonTestService>('SingletonService');
      const instance2 = adapter.get<SingletonTestService>('SingletonService');

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance1.instanceId).toBe(instance2.instanceId);
    });
  });

  describe('生命週期管理測試', () => {
    it('應該能夠註冊 SINGLETON 生命週期的服務', () => {
      // Act
      adapter.registerWithLifetime(
        'SingletonService',
        SingletonTestService,
        ServiceLifetime.SINGLETON,
      );
      const instance1 = adapter.get<SingletonTestService>('SingletonService');
      const instance2 = adapter.get<SingletonTestService>('SingletonService');

      // Assert
      expect(instance1).toBe(instance2);
    });

    it('應該能夠註冊 TRANSIENT 生命週期的服務', () => {
      // Act
      adapter.registerWithLifetime(
        'TransientService',
        TestService,
        ServiceLifetime.TRANSIENT,
      );
      const instance1 = adapter.get<TestService>('TransientService');
      const instance2 = adapter.get<TestService>('TransientService');

      // Assert
      expect(instance1).not.toBe(instance2);
      expect(instance1).toBeInstanceOf(TestService);
      expect(instance2).toBeInstanceOf(TestService);
    });

    it('應該能夠註冊 SCOPED 生命週期的服務（作為 SINGLETON 處理）', () => {
      // Act
      adapter.registerWithLifetime(
        'ScopedService',
        SingletonTestService,
        ServiceLifetime.SCOPED,
      );
      const instance1 = adapter.get<SingletonTestService>('ScopedService');
      const instance2 = adapter.get<SingletonTestService>('ScopedService');

      // Assert
      expect(instance1).toBe(instance2);
    });
  });

  describe('容器管理測試', () => {
    it('應該能夠檢查服務是否已註冊', () => {
      // Arrange
      const registeredToken = 'RegisteredToken';
      const unregisteredToken = 'UnregisteredToken';

      // Act
      adapter.register(registeredToken, 'test-value');

      // Assert
      expect(adapter.isRegistered(registeredToken)).toBe(true);
      expect(adapter.isRegistered(unregisteredToken)).toBe(false);
    });

    it('應該能夠清除容器', () => {
      // Arrange
      adapter.registerSingleton('TestService', SingletonTestService);
      const instance1 = adapter.get<SingletonTestService>('TestService');

      // Act
      adapter.clear();
      const instance2 = adapter.get<SingletonTestService>('TestService');

      // Assert
      expect(instance1).not.toBe(instance2);
    });

    it('應該能夠建立子容器', () => {
      // Arrange
      adapter.register('ParentService', 'parent-value');

      // Act
      const childAdapter = adapter.createChildContainer();
      childAdapter.register('ChildService', 'child-value');

      // Assert
      expect(adapter.get<string>('ParentService')).toBe('parent-value');
      expect(childAdapter.get<string>('ParentService')).toBe('parent-value');
      expect(childAdapter.get<string>('ChildService')).toBe('child-value');

      // 父容器不應該能夠存取子容器的服務
      expect(() => adapter.get<string>('ChildService')).toThrow();
    });

    it('應該能夠取得原生容器實例', () => {
      // Act
      const nativeContainer = adapter.nativeContainer;

      // Assert
      expect(nativeContainer).toBeDefined();
      expect(typeof nativeContainer.resolve).toBe('function');
    });
  });

  describe('錯誤處理測試', () => {
    it('當解析未註冊的服務時應該拋出錯誤', () => {
      // Act & Assert
      expect(() => adapter.get('UnregisteredService')).toThrow();
    });

    it('isRegistered 方法應該正確處理未註冊的服務', () => {
      // Act & Assert
      expect(adapter.isRegistered('UnregisteredService')).toBe(false);
    });
  });
});
