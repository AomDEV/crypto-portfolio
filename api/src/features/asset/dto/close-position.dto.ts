import { ZERO_UUID } from "@/common/constants/uuid";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, IsUUID } from "class-validator";

export class ClosePositionDTO {
    @ApiProperty({ type: String, description: 'Position ID', example: ZERO_UUID })
    @IsUUID()
    @IsString()
    @IsDefined()
    readonly position_id: string;
}