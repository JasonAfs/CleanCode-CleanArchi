import { IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDealershipDTO } from '@application/dtos/dealership/CreateDealershipDTO';

export class CreateDealershipRequestDTO implements Omit<CreateDealershipDTO, 'userId' | 'userRole'> {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    name!: string;

    @ApiProperty()
    @IsString()
    @MinLength(5)
    street!: string;

    @ApiProperty()
    @IsString()
    @MinLength(2)
    city!: string;

    @ApiProperty()
    @IsString()
    @Matches(/^\d{5}$/, { message: 'Invalid postal code format' })
    postalCode!: string;

    @ApiProperty()
    @IsString()
    @MinLength(2)
    country!: string;

    @ApiProperty()
    @IsString()
    @Matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
        message: 'Invalid phone number format'
    })
    phone!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;
}