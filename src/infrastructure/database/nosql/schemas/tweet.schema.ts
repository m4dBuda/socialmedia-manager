import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class TweetDocument extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop([String])
  hashtags: string[];

  @Prop({ required: true })
  user: string;
}

export const TweetSchema = SchemaFactory.createForClass(TweetDocument);
