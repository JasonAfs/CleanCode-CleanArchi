import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@domain/enums/UserRole';
import { AddCompanyEmployeeDTO } from '@application/dtos/company/request/AddCompanyEmployeeDTO';

export class AddCompanyEmployeeRequestDTO implements Omit<AddCompanyEmployeeDTO, 'userId' | 'userRole' | 'companyId' | 'dealershipId'> {
    @ApiProperty()
    @IsString()
    employeeId!: string;

    @ApiProperty({ 
        enum: UserRole,
        description: 'Le rôle à assigner à l\'employé dans l\'entreprise',
        example: UserRole.COMPANY_MANAGER
    })
    @IsEnum(UserRole)
    role!: UserRole;
}