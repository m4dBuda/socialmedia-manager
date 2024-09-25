import { Inject, Module, OnModuleInit } from "@nestjs/common";

import { SocialMediaPostModule } from "../social-media-post/social-media-post.module";
import { StreamSocialMediaPost } from "./scripts/stream-social-media-post.script";

@Module({
  imports: [SocialMediaPostModule],
  providers: [StreamSocialMediaPost],
})
export class StreamModule implements OnModuleInit {
  @Inject(StreamSocialMediaPost)
  private readonly streamSocialMediaPost: StreamSocialMediaPost;

  async onModuleInit() {
    await this.delay(5000);
    await this.streamSocialMediaPost.startStreaming();
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
