import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCompanyDTO } from '@application/dtos/company/CreateCompanyDTO';

export class CreateCompanyRequestDTO implements Omit<CreateCompanyDTO, 'userId' | 'userRole' | 'dealershipId'> {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    registrationNumber!: string;

    @ApiProperty()
    @IsString()
    street!: string;

    @ApiProperty()
    @IsString()
    city!: string;

    @ApiProperty()
    @IsString()
    postalCode!: string;

    @ApiProperty()
    @IsString()
    country!: string;

    @ApiProperty()
    @IsString()
    phone!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;
}