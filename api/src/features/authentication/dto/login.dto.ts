import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, MinLength } from "class-validator";

export class LoginDTO {
    @ApiProperty({ type: String, description: 'Username', example: 'john' })
    @IsString()
    @MinLength(4)
    @IsDefined()
    readonly username: string;

    @ApiProperty({ type: String, description: 'Password', example: 'password' })
    @IsString()
    @MinLength(6)
    @IsDefined()
    readonly password: string;
}