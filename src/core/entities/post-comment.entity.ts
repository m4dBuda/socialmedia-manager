import { User } from "./user.entity";

export class PostComment {
  user: User;
  text: string;
  timestamp: Date;
}
