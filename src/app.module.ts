import { Inject, Module, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as readline from "readline";

import { AnomalyModule } from "./modules/anomaly/anomaly.module";
import { SocialMediaPostModule } from "./modules/social-media-post/social-media-post.module";
import { StreamSocialMediaPost } from "./modules/stream/scripts/stream-social-media-post.script";
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
export class AppModule implements OnApplicationBootstrap {
  @Inject(StreamSocialMediaPost)
  private readonly streamSocialMediaPost: StreamSocialMediaPost;

  async onApplicationBootstrap() {
    process.nextTick(async () => {
      await this.delay(5000);
      const userResponse = await this.askUser();
      if (userResponse.toLowerCase() === "y") {
        await this.delay(5000);
        await this.streamSocialMediaPost.startStreaming();
      } else {
        console.log("Stream data simulator is not activated.");
      }
    });
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private askUser(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Do you want to activate the stream data simulator? (Y/N): ", (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
}
