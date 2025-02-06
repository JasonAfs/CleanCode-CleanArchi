import { IsString, IsInt, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MotorcycleModel, MotorcycleModelDisplayNames } from '@domain/enums/MotorcycleEnums';
import { CreateMotorcycleDTO } from '@application/dtos/motorcycle/request/CreateMotorcycleDTO';

export class CreateMotorcycleRequestDTO 
    implements Omit<CreateMotorcycleDTO, 'userId' | 'userRole'> {
    @ApiProperty()
    @IsString()
    vin!: string;

    @ApiProperty({ 
        enum: MotorcycleModel,
        enumName: 'MotorcycleModel',
        example: 'TIGER_900_RALLY_PRO',
        description: Object.entries(MotorcycleModelDisplayNames)
            .map(([key, value]) => `${key} (${value})`)
            .join(', ')
    })
    @IsEnum(MotorcycleModel)
    modelType!: MotorcycleModel;

    @ApiProperty()
    @IsInt()
    @Min(1900)
    year!: number;

    @ApiProperty()
    @IsString()
    color!: string;

    @ApiProperty()
    @IsInt()
    @Min(0)
    mileage!: number;

    @ApiProperty()
    @IsString()
    dealershipId!: string;
}
