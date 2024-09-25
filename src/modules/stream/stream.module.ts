import { Module } from "@nestjs/common";

import { SocialMediaPostModule } from "../social-media-post/social-media-post.module";
import { StreamSocialMediaPost } from "./scripts/stream-social-media-post.script";

@Module({
  imports: [SocialMediaPostModule],
  providers: [StreamSocialMediaPost],
  exports: [StreamSocialMediaPost],
})
export class StreamModule {}
