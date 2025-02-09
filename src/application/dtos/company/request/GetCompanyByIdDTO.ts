import { BaseAuthenticatedDTO } from '@application/dtos/shared/BaseAuthenticatedDTO';

export interface GetCompanyByIdDTO extends BaseAuthenticatedDTO {
  companyId: string;
}
