import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import * as knexConfig from '../../knexfile';

@Module({
  imports: [
    KnexModule.forRoot({
      config: knexConfig.production,
    }),
  ],
})
export class DatabaseModule {}
