import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";

import { MongoSocialMediaPostRepository } from "./repositories/social-media-post.repository";
import { SocialMediaPostSchema } from "./schemas/social-media-post.schema";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI"),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: SocialMediaPost.name, schema: SocialMediaPostSchema }]),
  ],
  providers: [MongoSocialMediaPostRepository],
  exports: [MongoSocialMediaPostRepository, MongooseModule], // Ensure MongooseModule is exported
})
export class NoSQLModule {}
