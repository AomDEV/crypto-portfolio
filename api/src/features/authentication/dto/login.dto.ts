import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEthereumAddress, IsHexadecimal, IsString } from "class-validator";

export class LoginDTO {
    @ApiProperty({
        type: String,
        description: 'Signature of the message',
        example: '0x1234567890abcdef1234567890abcdef12345678'
    })
    @IsString()
    @IsHexadecimal()
    @IsDefined()
    signature: string;

    @ApiProperty({
        type: String,
        description: 'Message to be signed',
        example: 'Hello World!'
    })
    @IsString()
    @IsDefined()
    message: string;

    @ApiProperty({
        type: String,
        description: 'Address of the user',
        example: '0x1234567890abcdef1234567890abcdef12345678'
    })
    @IsString()
    @IsEthereumAddress()
    @IsDefined()
    wallet_address: string;
}