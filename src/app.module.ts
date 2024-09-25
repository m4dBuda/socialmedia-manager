import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AnomalyModule } from "./modules/anomaly/anomaly.module";
import { SocialMediaPostModule } from "./modules/social-media-post/social-media-post.module";
import { StreamModule } from "./modules/stream/stream.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    SocialMediaPostModule,
    AnomalyModule,
    StreamModule,
  ],
})
export class AppModule {}
