import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@domain/enums/UserRole';

export class GetDealershipEmployeesRequestDTO {
    @ApiPropertyOptional({ enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    roleFilter?: UserRole;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    includeInactive?: boolean = false;
}