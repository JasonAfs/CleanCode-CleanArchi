export interface RemoveDealershipEmployeeResponseDTO {
    success: boolean;
    message: string;
    dealershipId: string;
    removedEmployeeId: string;
    remainingEmployeesCount: number;
}