import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { MongoTweetRepository } from "./repositories/tweet.repository";
import { TweetDocument, TweetSchema } from "./schemas/tweet.schema";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI"),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: TweetDocument.name, schema: TweetSchema }]),
  ],
  providers: [MongoTweetRepository],
  exports: [MongoTweetRepository],
})
export class NoSQLModule {}
