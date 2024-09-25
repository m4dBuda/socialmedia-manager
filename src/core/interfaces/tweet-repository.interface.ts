import { Tweet } from "../entities/tweet.entity";

export interface ITweetRepository {
  create(tweet: Tweet): Promise<Tweet>;
  findAll(): Promise<Tweet[]>;
  findByHashtag(hashtag: string): Promise<Tweet[]>;
  archiveOldTweets(cutoffDate: Date): Promise<void>;
  limitToMaxTweets(maxTweets: number): Promise<void>;
}
