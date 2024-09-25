import { Module, forwardRef } from "@nestjs/common";

import { SocialMediaPostUseCase } from "~/core/use-cases/social-media-post.use-case";
import { NoSQLModule } from "~/infrastructure/database/nosql/nosql.module";

import { SocialMediaPostController } from "./social-media-post.controller";
import { SocialMediaPostService } from "./social-media-post.service";

@Module({
  imports: [forwardRef(() => NoSQLModule)],
  controllers: [SocialMediaPostController],
  providers: [SocialMediaPostService, SocialMediaPostUseCase],
  exports: [SocialMediaPostService],
})
export class SocialMediaPostModule {}