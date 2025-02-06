import { Permission } from "../Permission";

export class PermissionRuleMapper {
    private static readonly permissionToRule = new Map<Permission, string>([
        // Permissions de consultation/lecture des concessions
        [Permission.VIEW_DEALERSHIP_DETAILS, 'dealership.access'],
        
        // Permissions de gestion des employés des concessions
        [Permission.MANAGE_DEALERSHIP_EMPLOYEES, 'dealership.access'],
        
        // Permissions de gestion générale des concessions
        [Permission.MANAGE_DEALERSHIP, 'dealership.access'],
        [Permission.MANAGE_ALL_DEALERSHIPS, 'dealership.access'],
        
        // Permissions liées aux motos
        
        // Permissions de maintenance

        // Permissions entreprises partenaires
        [Permission.MANAGE_COMPANY, 'company.access'],
        [Permission.MANAGE_COMPANY_USERS, 'company.access'],
        [Permission.VIEW_COMPANY_DETAILS, 'company.access'],
    ]);

    public static getRuleType(permission: Permission): string {
        const ruleType = this.permissionToRule.get(permission);
        if (!ruleType) {
            throw new Error(`No rule mapping found for permission: ${permission}`);
        }
        return ruleType;
    }
}