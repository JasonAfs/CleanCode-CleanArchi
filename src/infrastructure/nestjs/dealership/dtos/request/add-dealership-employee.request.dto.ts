import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@domain/enums/UserRole';

export class AddDealershipEmployeeRequestDTO {
    @ApiProperty()
    @IsString()
    employeeId!: string;

    @ApiProperty({ enum: UserRole })
    @IsEnum(UserRole)
    role!: UserRole;
}