import { Module, Provider } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { MODULE as JwtModule } from "@/common/providers/jwt.provider";
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/common/middlewares/jwt.strategy';
import { APP_GUARDS } from '@/common/constants/provider';

// @features
import { AuthenticationModule } from '@/features/authentication/authentication.module';
import { AssetModule } from '@/features/asset/asset.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
	imports: [
		PassportModule,
		JwtModule,
		CacheModule.register({
			isGlobal: true,
		}),
		ScheduleModule.forRoot(),
		EventEmitterModule.forRoot({
			ignoreErrors: false,
      		verboseMemoryLeak: false,
		}),

		AuthenticationModule,
		AssetModule,
	],
	controllers: [],
	providers: ([
		JwtStrategy,
	] as Provider[]).concat(APP_GUARDS.map((useClass) => ({
		provide: APP_GUARD,
		useClass,
	})) as []).concat([
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		}
	]),
})
export class AppModule { }
