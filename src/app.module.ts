import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { NoSQLModule } from "./infrastructure/database/nosql/nosql.module";
import { TweetModule } from "./modules/tweet/tweet.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NoSQLModule,
    TweetModule,
  ],
})
export class AppModule {}
