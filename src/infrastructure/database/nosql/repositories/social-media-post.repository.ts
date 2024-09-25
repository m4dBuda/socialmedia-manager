import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";

import { SocialMediaPostDocument } from "../schemas/social-media-post.schema";

@Injectable()
export class MongoSocialMediaPostRepository {
  constructor(@InjectModel(SocialMediaPost.name) private socialMediaPostModel: Model<SocialMediaPostDocument>) {}

  public async create(post: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    const newPost = new this.socialMediaPostModel(post);
    return newPost.save();
  }

  public async findAll({
    skip,
    limit,
    filters,
  }: {
    skip: number;
    limit: number;
    filters: any;
  }): Promise<SocialMediaPost[]> {
    const query: any = {};
    if (filters.user) {
      query["user.username"] = filters.user;
    }
    if (filters.platform) {
      query.platform = filters.platform;
    }
    if (filters.hashtag) {
      query.hashtags = filters.hashtag;
    }
    return this.socialMediaPostModel.find(query).skip(skip).limit(limit).exec();
  }

  public async findByHashtag({
    skip,
    limit,
    hashtag,
  }: {
    skip: number;
    limit: number;
    hashtag: string;
  }): Promise<SocialMediaPost[]> {
    return this.socialMediaPostModel.find({ hashtags: hashtag }).skip(skip).limit(limit).exec();
  }

  public async archiveOldPosts(cutoffDate: Date): Promise<void> {
    await this.socialMediaPostModel.updateMany({ timestamp: { $lt: cutoffDate } }, { $set: { archived: true } }).exec();
  }

  public async limitToMaxPosts(maxPosts: number): Promise<void> {
    const count = await this.socialMediaPostModel.countDocuments().exec();
    if (count > maxPosts) {
      const excess = count - maxPosts;
      await this.socialMediaPostModel.find().sort({ timestamp: 1 }).limit(excess).deleteOne().exec();
    }
  }
}
