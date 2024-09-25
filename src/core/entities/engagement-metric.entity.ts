import { ApiProperty } from "@nestjs/swagger";

export class EngagementMetrics {
  @ApiProperty()
  likes?: number;

  @ApiProperty()
  shares?: number;

  @ApiProperty()
  views?: number;
}
