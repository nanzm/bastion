import { CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { MyConfigModule } from 'libs/datasource/config';
import { ConfigService } from '@nestjs/config';

export const MyCacheModule = CacheModule.registerAsync({
  imports: [MyConfigModule],
  useFactory: async (configService: ConfigService) => ({
    store: redisStore,
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  }),
  inject: [ConfigService],
});
