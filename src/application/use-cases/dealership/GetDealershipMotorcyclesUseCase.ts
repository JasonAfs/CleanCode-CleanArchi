import { GetDealershipMotorcyclesDTO } from "@application/dtos/dealership/request/GetDealershipMotorcyclesDTO";
import { IMotorcycleRepository } from "@application/ports/repositories/IMotorcycleRepository";
import { MotorcycleResponseDTO } from "@application/dtos/motorcycle/response/MotorcycleResponseDTO";
import { Result } from "@domain/shared/Result";
import { UserRole } from "@domain/enums/UserRole";
import { UnauthorizedError } from "@domain/errors/authorization/UnauthorizedError";
import { MotorcycleMapper } from "@application/mappers/MotorcycleMapper";
import { ROLE_PERMISSIONS } from "@domain/services/authorization/PermissionRegistry";
import { Permission } from "@domain/services/authorization/Permission";

export class GetDealershipMotorcyclesUseCase {
    constructor(
        private readonly motorcycleRepository: IMotorcycleRepository
    ) {}

    private hasPermission(role: UserRole, permission: Permission): boolean {
        const permissions = ROLE_PERMISSIONS.get(role);
        return permissions?.has(permission) ?? false;
    }

    public async execute(
        dto: GetDealershipMotorcyclesDTO
    ): Promise<Result<MotorcycleResponseDTO[], Error>> {
        try {
            // 1. Vérification des permissions
            if (!this.hasPermission(dto.userRole, Permission.VIEW_MOTORCYCLE_DETAILS)) {
                return new UnauthorizedError("You don't have permission to view motorcycles");
            }

            // 2. Vérification du rôle et de l'accès
            if (dto.userRole !== UserRole.TRIUMPH_ADMIN && 
                dto.userRole !== UserRole.DEALERSHIP_MANAGER) {
                return new UnauthorizedError("Only TRIUMPH_ADMIN or DEALERSHIP_MANAGER can view dealership motorcycles");
            }

            // 3. Pour les managers de concession, vérifier qu'ils accèdent à leur propre concession
            if (dto.userRole === UserRole.DEALERSHIP_MANAGER && !dto.userDealershipId) {
                return new UnauthorizedError("Dealership manager must be associated with a dealership");
            }

            // 4. Récupération des motos
            let motorcycles = await this.motorcycleRepository.findByDealership(
                dto.userDealershipId!
            );

            // 5. Application des filtres
            if (!dto.includeInactive) {
                motorcycles = motorcycles.filter(motorcycle => motorcycle.isActive);
            }

            if (dto.statusFilter) {
                motorcycles = motorcycles.filter(motorcycle => motorcycle.status === dto.statusFilter);
            }

            // 6. Mapping vers le DTO de réponse
            return motorcycles.map(motorcycle => MotorcycleMapper.toDTO(motorcycle));

        } catch (error) {
            if (error instanceof Error) {
                return error;
            }
            return new Error('An unexpected error occurred while retrieving dealership motorcycles');
        }
    }
}