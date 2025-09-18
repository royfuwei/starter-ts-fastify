import { describe, it, expect } from 'vitest';
import {
  Service,
  SingletonService,
  getServiceToken,
  getServiceLifetime,
  Injectable,
  Singleton,
  Inject,
} from '../decorators';

// 測試用的服務類別
@Service('TestService')
class TestServiceWithToken {
  getValue(): string {
    return 'test-value';
  }
}

@Service()
class TestServiceWithoutToken {
  getValue(): string {
    return 'test-value';
  }
}

@SingletonService('SingletonTestService')
class SingletonTestServiceWithToken {
  getValue(): string {
    return 'singleton-value';
  }
}

@SingletonService()
class SingletonTestServiceWithoutToken {
  getValue(): string {
    return 'singleton-value';
  }
}

@Injectable()
class InjectableTestService {
  getValue(): string {
    return 'injectable-value';
  }
}

@Singleton()
class SingletonDecoratorTestService {
  getValue(): string {
    return 'singleton-decorator-value';
  }
}

class ServiceWithDependency {
  constructor(@Inject('TestDependency') private dependency: unknown) {}

  getDependency(): unknown {
    return this.dependency;
  }
}

describe('Service Decorators', () => {
  describe('@Service 裝飾器', () => {
    it('應該能夠標記類別為服務並設定 token', () => {
      // Act
      const token = getServiceToken(TestServiceWithToken);

      // Assert
      expect(token).toBe('TestService');
    });

    it('應該能夠標記類別為服務而不設定 token', () => {
      // Act
      const token = getServiceToken(TestServiceWithoutToken);

      // Assert
      expect(token).toBeUndefined();
    });

    it('應該能夠建立服務實例', () => {
      // Act
      const instance = new TestServiceWithToken();

      // Assert
      expect(instance).toBeInstanceOf(TestServiceWithToken);
      expect(instance.getValue()).toBe('test-value');
    });
  });

  describe('@SingletonService 裝飾器', () => {
    it('應該能夠標記類別為單例服務並設定 token', () => {
      // Act
      const token = getServiceToken(SingletonTestServiceWithToken);
      const lifetime = getServiceLifetime(SingletonTestServiceWithToken);

      // Assert
      expect(token).toBe('SingletonTestService');
      expect(lifetime).toBe('singleton');
    });

    it('應該能夠標記類別為單例服務而不設定 token', () => {
      // Act
      const token = getServiceToken(SingletonTestServiceWithoutToken);
      const lifetime = getServiceLifetime(SingletonTestServiceWithoutToken);

      // Assert
      expect(token).toBeUndefined();
      expect(lifetime).toBeUndefined(); // 沒有 token 時不會設定 lifetime metadata
    });

    it('應該能夠建立單例服務實例', () => {
      // Act
      const instance = new SingletonTestServiceWithToken();

      // Assert
      expect(instance).toBeInstanceOf(SingletonTestServiceWithToken);
      expect(instance.getValue()).toBe('singleton-value');
    });
  });

  describe('tsyringe 裝飾器重新匯出', () => {
    it('@Injectable 應該能夠正常運作', () => {
      // Act
      const instance = new InjectableTestService();

      // Assert
      expect(instance).toBeInstanceOf(InjectableTestService);
      expect(instance.getValue()).toBe('injectable-value');
    });

    it('@Singleton 應該能夠正常運作', () => {
      // Act
      const instance = new SingletonDecoratorTestService();

      // Assert
      expect(instance).toBeInstanceOf(SingletonDecoratorTestService);
      expect(instance.getValue()).toBe('singleton-decorator-value');
    });

    it('@Inject 應該能夠正常運作', () => {
      // Act
      const instance = new ServiceWithDependency('test-dependency');

      // Assert
      expect(instance).toBeInstanceOf(ServiceWithDependency);
      expect(instance.getDependency()).toBe('test-dependency');
    });
  });

  describe('Metadata 工具函數', () => {
    it('getServiceToken 應該能夠取得正確的 token', () => {
      // Act
      const tokenWithToken = getServiceToken(TestServiceWithToken);
      const tokenWithoutToken = getServiceToken(TestServiceWithoutToken);

      // Assert
      expect(tokenWithToken).toBe('TestService');
      expect(tokenWithoutToken).toBeUndefined();
    });

    it('getServiceLifetime 應該能夠取得正確的生命週期', () => {
      // Act
      const lifetimeWithToken = getServiceLifetime(SingletonTestServiceWithToken);
      const lifetimeWithoutToken = getServiceLifetime(SingletonTestServiceWithoutToken);
      const regularServiceLifetime = getServiceLifetime(TestServiceWithToken);

      // Assert
      expect(lifetimeWithToken).toBe('singleton');
      expect(lifetimeWithoutToken).toBeUndefined();
      expect(regularServiceLifetime).toBeUndefined();
    });

    it('對於沒有使用裝飾器的類別應該回傳 undefined', () => {
      // Arrange
      class PlainClass {}

      // Act
      const token = getServiceToken(PlainClass);
      const lifetime = getServiceLifetime(PlainClass);

      // Assert
      expect(token).toBeUndefined();
      expect(lifetime).toBeUndefined();
    });
  });
});
