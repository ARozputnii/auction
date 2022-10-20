import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { TestModule } from '#test/config/test.module';
import { Type, ValidationPipe } from '@nestjs/common';
import { TestCore } from '#test/config/test-core';

export class TestCoreBuilder {
  protected constructor(protected moduleBuilder: TestingModuleBuilder) {}

  public static init(...testableModules: Type<unknown>[]): TestCoreBuilder {
    const moduleBuilder: TestingModuleBuilder = Test.createTestingModule({
      imports: [TestModule, ...testableModules],
    });

    return new TestCoreBuilder(moduleBuilder);
  }

  public async build() {
    const module = await this.moduleBuilder.compile();
    const app = module.createNestApplication().useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    return new TestCore(app, module);
  }
}
