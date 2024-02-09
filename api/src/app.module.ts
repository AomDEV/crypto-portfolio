import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';

// @features
import { AuthenticationModule } from '@/features/authentication/authentication.module';
import { PortfolioModule } from '@/features/portfolio/portfolio.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),

    AuthenticationModule,
    PortfolioModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }
  ],
})
export class AppModule {}
