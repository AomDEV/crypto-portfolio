import { ApiProperty } from "@nestjs/swagger";
import { LoginDTO } from "./login.dto";
import { IsDefined, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDTO extends LoginDTO {
    @ApiProperty({ type: String, description: 'First name', example: 'John' })
    @IsString()
    @MinLength(2)
    @IsDefined()
    readonly first_name: string;

    @ApiProperty({ type: String, description: 'Last name', example: 'Doe' })
    @IsString()
    @MinLength(2)
    @IsDefined()
    readonly last_name: string;

    @ApiProperty({ type: String, description: 'Confirm password', example: 'password' })
    @IsString()
    @MinLength(6)
    @IsDefined()
    readonly confirm_password: string;

    @ApiProperty({ type: String, description: 'Email', example: 'john@email.com', required: false })
    @IsString()
    @IsEmail()
    @IsOptional()
    readonly email?: string;
}