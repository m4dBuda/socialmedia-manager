import { ApiProperty } from "@nestjs/swagger";

import { User } from "./user.entity";

export class PostComment {
  @ApiProperty()
  user: User;

  @ApiProperty()
  text: string;

  @ApiProperty()
  timestamp: Date;
}
