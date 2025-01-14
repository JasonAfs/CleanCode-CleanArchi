export interface UpdateCompanyInfoDTO {
    companyId: string;
    name?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
}