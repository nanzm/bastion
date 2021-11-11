import { Module } from '@nestjs/common';

import { MyConfigModule } from 'libs/datasource/config';
import { MyBullModule, MyDatabase, MyElasticModule } from 'libs/datasource';

import { NotifyModule } from './notify/notify.module';
import { EventModule } from './event/event.module';
import { IssueModule } from './issue/issue.module';

@Module({
  imports: [
    MyBullModule,
    MyElasticModule,
    MyConfigModule,
    MyDatabase,
    NotifyModule,
    EventModule,
    IssueModule,
  ],
})
export class AppModule {}
