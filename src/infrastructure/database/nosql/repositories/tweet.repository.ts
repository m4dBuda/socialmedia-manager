import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Tweet } from "~/core/entities/tweet.entity";
import { ITweetRepository } from "~/core/interfaces/tweet-repository.interface";

import { TweetDocument } from "../schemas/tweet.schema";

@Injectable()
export class MongoTweetRepository implements ITweetRepository {
  constructor(@InjectModel(TweetDocument.name) private readonly tweetModel: Model<TweetDocument>) {}

  public async create(tweetData: Partial<Tweet>): Promise<Tweet> {
    const createdTweet = new this.tweetModel(tweetData);
    return createdTweet.save();
  }

  public async findAll(): Promise<Tweet[]> {
    return this.tweetModel.find().exec();
  }

  public async findByHashtag(hashtag: string): Promise<Tweet[]> {
    return this.tweetModel.find({ hashtags: hashtag }).exec();
  }

  public async archiveOldTweets(cutoffDate: Date): Promise<void> {
    await this.tweetModel.deleteMany({ timestamp: { $lt: cutoffDate } }).exec();
  }

  public async limitToMaxTweets(maxTweets: number): Promise<void> {
    const count = await this.tweetModel.countDocuments().exec();
    if (count > maxTweets) {
      const excess = count - maxTweets;
      await this.tweetModel.find().sort({ timestamp: 1 }).limit(excess).deleteMany().exec();
    }
  }
}
