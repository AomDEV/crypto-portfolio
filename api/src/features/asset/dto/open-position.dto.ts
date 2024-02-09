import { ZERO_UUID } from "@/common/constants/uuid";
import { ApiProperty } from "@nestjs/swagger";
import { EDirection } from "@prisma/client";
import { IsDefined, IsEnum, IsNumber, IsNumberString, IsUUID, Max, Min } from "class-validator";

export class OpenPositionDTO {
    @ApiProperty({ type: Number, description: 'Leverage', example: 1 })
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsDefined()
    readonly leverage: number;

    @ApiProperty({ enum: EDirection, description: 'Direction', example: EDirection.LONG })
    @IsEnum(EDirection)
    @IsDefined()
    readonly direction: EDirection;

    @ApiProperty({ type: String, description: 'Amount', example: '100' })
    @IsNumberString()
    @IsDefined()
    readonly amount: string;
}