import { ApiProperty } from '@nestjs/swagger';
import { DeactivateCompanyDTO } from '@application/dtos/company/DeactivateCompanyDTO';

// Ce DTO est vide car toutes les données viennent de l'URL et du token
export class DeactivateCompanyRequestDTO implements Omit<DeactivateCompanyDTO, 'userId' | 'userRole' | 'companyId'> {}


//todo: bizard