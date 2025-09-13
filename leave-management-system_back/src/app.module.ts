import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
// import { LeaveTypesController } from './leave-types/leave-types.controller';
// import { LeaveTypesService } from './leave-types/leave-types.service';
import { HolidaysModule } from './holidays/holidays.module';
// import { ProfileModule } from './profile/profile.module';
// import { ProfileService } from './profile/profile.service';
// import { ProfileController } from './profile/profile.controller';
// import { LeaveBalancesModule } from './leave-balances/leave-balances.module';
// import { LeaveTypesModule } from './leave-types/leave-types.module';


@Module({
  imports: [
    // 1) Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // 2) Temporarily disable TypeORM to test auth without DB
    // TypeOrmModule.forRootAsync({...}),

    // 3) Import minimal modules for auth testing
    SharedModule,
    // UsersModule,
    AuthModule,
    // TeamsModule,
    // HolidaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
