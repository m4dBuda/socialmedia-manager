import { Tweet } from "../entities/tweet.entity";
import { ITweetRepository } from "../interfaces/tweet-repository.interface";

export class TweetUseCase {
  constructor(private tweetRepository: ITweetRepository) {}

  async createTweet(tweetData: Partial<Tweet>): Promise<Tweet> {
    const tweet = new Tweet();
    Object.assign(tweet, tweetData);
    return this.tweetRepository.create(tweet);
  }

  async getAllTweets(): Promise<Tweet[]> {
    return this.tweetRepository.findAll();
  }

  async searchTweetsByHashtag(hashtag: string): Promise<Tweet[]> {
    return this.tweetRepository.findByHashtag(hashtag);
  }
}
