import { Module } from "@nestjs/common";

import { TweetUseCase } from "~/core/use-cases/tweet.use-case";
import { NoSQLModule } from "~/infrastructure/database/nosql/nosql.module";

import { TweetController } from "./tweet.controller";

@Module({
  imports: [NoSQLModule],
  controllers: [TweetController],
  providers: [TweetUseCase],
})
export class TweetModule {}
