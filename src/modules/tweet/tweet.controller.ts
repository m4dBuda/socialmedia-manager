import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";

import { TweetUseCase } from "~/core/use-cases/tweet.use-case";
import { MongoTweetRepository } from "~/infrastructure/database/nosql/repositories/tweet.repository";

import { Tweet } from "../../core/entities/tweet.entity";
import { ITweetRepository } from "../../core/interfaces/tweet-repository.interface";

@Controller("tweets")
export class TweetController {
  @Inject(TweetUseCase)
  private tweetUseCase: TweetUseCase;

  constructor(@Inject(MongoTweetRepository) tweetRepository: ITweetRepository) {
    this.tweetUseCase = new TweetUseCase(tweetRepository);
  }

  @Post()
  public async createTweet(@Body() tweetData: Partial<Tweet>): Promise<Tweet> {
    return this.tweetUseCase.createTweet(tweetData);
  }

  @Get()
  public async getAllTweets(): Promise<Tweet[]> {
    return this.tweetUseCase.getAllTweets();
  }

  @Get("search")
  public async findTweetsByHashtag(@Query("hashtag") hashtag: string): Promise<Tweet[]> {
    return this.tweetUseCase.searchTweetsByHashtag(hashtag);
  }
}
